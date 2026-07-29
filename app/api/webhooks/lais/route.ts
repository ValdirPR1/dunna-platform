import { NextRequest, NextResponse } from "next/server";
import { criarLeadSite } from "@/features/site/services/leads.service";

// Webhook que recebe leads qualificados enviados pela Lais (SDR de IA
// no WhatsApp) e já cria o lead no CRM — mesma lógica usada pelos
// formulários do site (cria a pessoa, marca como lead e abre a
// oportunidade no Kanban), disparando os avisos por e-mail e push
// normalmente.
//
// Documentação da Lais: https://lastro.notion.site/Qualified-Lead-Webhook-fdbc8fc140004bdcac825d7f32176dca
//
// Autenticação: a Lais manda um header
//   Authorization: Bearer <LAIS_WEBHOOK_SECRET>
// (o valor de LAIS_WEBHOOK_SECRET é combinado com o time da Lais na
// hora de configurar o webhook do lado deles).
//
// Resposta esperada pela Lais: 201 Created com { success: true, message }
// em caso de sucesso; qualquer outro status é tratado como falha.

interface CreditAnalysisLais {
  provider?: string;
  amount?: number;
  status?: string;
  client_listing_id?: string;
  analysis_type?: string;
  vat_number?: string;
  provider_analysis_id?: string;
  reason?: string;
  chat_id?: string;
}

interface QualifiedLeadPayload {
  id: string;
  origin: string;
  name: string;
  email?: string;
  number: string;
  link?: string;
  portal_listing_id?: string;
  client_listing_id?: string;
  created_at: string;
  conversation_summary: string;
  conversation_history: string;
  transaction_type: "buy" | "rent" | "pre-launch" | string;
  delivery_triggered_by: string;
  area?: number;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  price_rent?: number;
  price_buy?: number;
  neighborhood?: string;
  parking_spaces?: number;
  city?: string;
  visit_request_date_time?: string;
  visit_request_date_time_options?: string[];
  credit_analysis?: CreditAnalysisLais;

  // Dados de campanha (UTM) — de qual anúncio/campanha o lead veio.
  // Só chegam preenchidos se o lead tiver entrado através de um
  // anúncio do Google ou do Facebook/Instagram.
  google_utm_medium?: string;
  google_utm_source?: string;
  google_external_id?: string;
  facebook_utm_medium?: string;
  facebook_utm_source?: string;
  facebook_utm_campaign?: string;
  facebook_utm_campaign_id?: string;
  facebook_utm_ad?: string;
  facebook_utm_ad_id?: string;
  facebook_utm_adset?: string;
  facebook_utm_adset_id?: string;
  facebook_utm_form_name?: string;
  facebook_utm_platform?: string;
  facebook_utm_account_id?: string;
  facebook_referral_ctwa_clid?: string;
  facebook_referral_headline?: string;
  facebook_referral_source_id?: string;
  facebook_referral_source_url?: string;
  facebook_referral_source_type?: string;
}

const TRANSACAO_PT: Record<string, string> = {
  buy: "Comprar",
  rent: "Alugar",
  "pre-launch": "Lançamento",
};

const MOTIVO_ENVIO_PT: Record<string, string> = {
  "qualified-by-lais": "Qualificado pela Lais",
  "qualified-by-client": "Qualificado manualmente pelo corretor",
  "invalid-phone-number": "Telefone inválido — precisa contato por outro canal",
  "auto-sent": "Enviado automaticamente (tempo de inatividade)",
  "visit-scheduled": "Visita agendada",
  "out-of-scope": "Fora do escopo de atendimento da Lais",
  "message-delivery-error": "Falha ao entregar mensagem no WhatsApp",
  "credit-analysis-completed": "Análise de crédito concluída",
  "qualified-by-classification": "Qualificado automaticamente por classificação",
};

function formatarMoeda(valor?: number) {
  if (!valor) return null;
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Monta um resumo legível de qual anúncio/campanha trouxe o lead —
// só aparece se a Lais mandar algum desses dados junto (nem todo
// lead vem de anúncio pago).
function montarBlocoCampanha(lead: QualifiedLeadPayload): string | null {
  const linhasGoogle = [
    lead.google_utm_source ? `fonte ${lead.google_utm_source}` : null,
    lead.google_utm_medium ? `meio ${lead.google_utm_medium}` : null,
    lead.google_external_id ? `id ${lead.google_external_id}` : null,
  ].filter(Boolean);

  const linhasFacebook = [
    lead.facebook_utm_campaign
      ? `campanha "${lead.facebook_utm_campaign}"${
          lead.facebook_utm_campaign_id ? ` (${lead.facebook_utm_campaign_id})` : ""
        }`
      : null,
    lead.facebook_utm_adset
      ? `conjunto "${lead.facebook_utm_adset}"${
          lead.facebook_utm_adset_id ? ` (${lead.facebook_utm_adset_id})` : ""
        }`
      : null,
    lead.facebook_utm_ad
      ? `anúncio "${lead.facebook_utm_ad}"${
          lead.facebook_utm_ad_id ? ` (${lead.facebook_utm_ad_id})` : ""
        }`
      : null,
    lead.facebook_utm_form_name ? `formulário "${lead.facebook_utm_form_name}"` : null,
    lead.facebook_utm_platform ? `plataforma ${lead.facebook_utm_platform}` : null,
  ].filter(Boolean);

  const linhasReferral = [
    lead.facebook_referral_headline ? `título do anúncio "${lead.facebook_referral_headline}"` : null,
    lead.facebook_referral_source_type ? `tipo ${lead.facebook_referral_source_type}` : null,
    lead.facebook_referral_source_url ? lead.facebook_referral_source_url : null,
  ].filter(Boolean);

  const blocos: string[] = [];
  if (linhasGoogle.length > 0) blocos.push(`Google Ads (${linhasGoogle.join(", ")})`);
  if (linhasFacebook.length > 0) blocos.push(`Facebook/Instagram Ads (${linhasFacebook.join(", ")})`);
  if (linhasReferral.length > 0) blocos.push(`Anúncio clique-para-WhatsApp (${linhasReferral.join(", ")})`);

  if (blocos.length === 0) return null;

  return `Veio de anúncio: ${blocos.join(" | ")}`;
}

function montarMensagem(lead: QualifiedLeadPayload): string {
  const partes: string[] = [];

  partes.push(lead.conversation_summary || "Lead qualificado pela Lais.");

  const detalhesImovel = [
    lead.transaction_type ? TRANSACAO_PT[lead.transaction_type] ?? lead.transaction_type : null,
    lead.type,
    lead.bedrooms ? `${lead.bedrooms} quartos` : null,
    lead.bathrooms ? `${lead.bathrooms} banheiros` : null,
    lead.parking_spaces ? `${lead.parking_spaces} vagas` : null,
    lead.area ? `${lead.area}m²` : null,
    lead.neighborhood,
    lead.city,
  ]
    .filter(Boolean)
    .join(" • ");

  if (detalhesImovel) {
    partes.push(`Imóvel de interesse: ${detalhesImovel}`);
  }

  const preco = formatarMoeda(lead.price_buy) ?? formatarMoeda(lead.price_rent);
  if (preco) {
    partes.push(`Valor: ${preco}`);
  }

  if (lead.link) {
    partes.push(`Anúncio: ${lead.link}`);
  }

  if (lead.client_listing_id) {
    partes.push(`Código do imóvel: ${lead.client_listing_id}`);
  }

  const blocoCampanha = montarBlocoCampanha(lead);
  if (blocoCampanha) {
    partes.push(blocoCampanha);
  }

  if (lead.visit_request_date_time) {
    partes.push(
      `Pediu visita para: ${new Date(lead.visit_request_date_time).toLocaleString("pt-BR")}`
    );
  }

  if (lead.credit_analysis?.status) {
    const statusPt = lead.credit_analysis.status === "approved" ? "aprovada" : "rejeitada";
    partes.push(
      `Análise de crédito (${lead.credit_analysis.provider ?? "—"}): ${statusPt}${
        lead.credit_analysis.reason ? ` — ${lead.credit_analysis.reason}` : ""
      }`
    );
  }

  partes.push(
    `Motivo do envio: ${MOTIVO_ENVIO_PT[lead.delivery_triggered_by] ?? lead.delivery_triggered_by}`
  );
  partes.push(`Conversa completa: ${lead.conversation_history}`);

  return partes.join("\n");
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!process.env.LAIS_WEBHOOK_SECRET || auth !== `Bearer ${process.env.LAIS_WEBHOOK_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Não autorizado." },
      { status: 401 }
    );
  }

  let payload: QualifiedLeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Corpo da requisição não é um JSON válido." },
      { status: 400 }
    );
  }

  const camposFaltando: string[] = [];
  if (!payload.name) camposFaltando.push("name");
  if (!payload.number) camposFaltando.push("number");
  if (!payload.id) camposFaltando.push("id");

  if (camposFaltando.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Campos obrigatórios ausentes.",
        errors: { campos: camposFaltando },
      },
      { status: 400 }
    );
  }

  try {
    await criarLeadSite({
      nome: payload.name,
      email: payload.email ?? "",
      telefone: payload.number,
      mensagem: montarMensagem(payload),
      origem: `Lais — ${payload.origin ?? "WhatsApp"}`,
    });

    return NextResponse.json(
      { success: true, message: "Lead recebido e criado no CRM." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao processar webhook da Lais:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao criar o lead no CRM.",
      },
      { status: 500 }
    );
  }
}
