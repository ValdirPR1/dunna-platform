import { supabase } from "@/lib/supabase";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";

async function enviarEmail(to: string, subject: string, html: string) {
  try {
    await fetch("/api/notificacoes/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });
  } catch (error) {
    // Notificação nunca deve travar o fluxo principal (criar/editar lead)
    console.error("Falha ao enviar e-mail de notificação:", error);
  }
}

// Avisa o master (você) sempre que um lead novo entra no sistema,
// seja pelo site ou cadastrado manualmente no CRM.
export async function notificarNovoLead(dados: {
  nome: string;
  origem: string;
  telefone?: string;
  observacoes?: string;
}) {
  const config = await obterConfiguracoes();
  const emailMaster = config.email_notificacao_master;

  if (!emailMaster) return;

  await enviarEmail(
    emailMaster,
    `🔔 Novo lead: ${dados.nome}`,
    `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2 style="color:#101828;">Novo lead recebido</h2>
        <p><strong>Nome:</strong> ${dados.nome}</p>
        ${dados.telefone ? `<p><strong>Telefone:</strong> ${dados.telefone}</p>` : ""}
        <p><strong>Origem:</strong> ${dados.origem}</p>
        ${dados.observacoes ? `<p><strong>Detalhes:</strong> ${dados.observacoes}</p>` : ""}
        <p style="margin-top:20px;color:#64748b;font-size:13px;">Dunna Platform</p>
      </div>
    `
  );
}

// Avisa um corretor específico quando um lead é atribuído (ou
// transferido) pra ele.
export async function notificarCorretorSobreLead(
  corretorId: string,
  dados: { nomeLead: string; titulo: string }
) {
  const { data: corretor } = await supabase
    .from("corretores")
    .select("nome, email")
    .eq("id", corretorId)
    .single();

  if (!corretor?.email) return;

  await enviarEmail(
    corretor.email,
    `📋 Novo lead atribuído a você: ${dados.nomeLead}`,
    `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2 style="color:#101828;">Você recebeu um novo lead</h2>
        <p>Olá, ${corretor.nome}!</p>
        <p><strong>Lead:</strong> ${dados.nomeLead}</p>
        <p><strong>Referente a:</strong> ${dados.titulo}</p>
        <p>Acesse o CRM da Dunna Platform para dar seguimento.</p>
        <p style="margin-top:20px;color:#64748b;font-size:13px;">Dunna Platform</p>
      </div>
    `
  );
}
