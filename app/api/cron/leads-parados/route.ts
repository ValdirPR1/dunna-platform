import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Roda uma vez por dia (configurado no vercel.json) verificando leads
// sem nenhuma movimentação há 15 dias ou mais, e manda um e-mail de
// aviso — tanto pro master quanto pro corretor responsável, se tiver.
export async function GET(request: NextRequest) {
  // Proteção simples: só a própria Vercel (com o segredo certo) pode
  // chamar essa rota, evitando que qualquer pessoa dispare os e-mails
  const segredo = request.headers.get("authorization");
  if (segredo !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const quinzeDiasAtras = new Date(
    Date.now() - 15 * 24 * 60 * 60 * 1000
  ).toISOString();

  const seteDiasAtras = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: leadsParados, error } = await supabaseAdmin
    .from("oportunidades")
    .select("id, titulo, atualizado_em, criado_em, corretor_id, pessoa_id")
    .not("etapa", "in", '("Contrato","Pós-venda")')
    .or(`atualizado_em.lt.${quinzeDiasAtras},atualizado_em.is.null`)
    .or(
      `ultimo_alerta_enviado.is.null,ultimo_alerta_enviado.lt.${seteDiasAtras}`
    );

  if (error) {
    console.error("Erro ao buscar leads parados:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!leadsParados || leadsParados.length === 0) {
    return NextResponse.json({ ok: true, avisados: 0 });
  }

  const { data: config } = await supabaseAdmin
    .from("configuracoes")
    .select("chave, valor")
    .eq("chave", "email_notificacao_master")
    .maybeSingle();

  const emailMaster = config?.valor as string | undefined;

  let avisados = 0;

  for (const lead of leadsParados) {
    const referencia = lead.atualizado_em ?? lead.criado_em;
    const dias = referencia
      ? Math.floor(
          (Date.now() - new Date(referencia).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : "vários";

    const { data: pessoa } = await supabaseAdmin
      .from("pessoas")
      .select("nome")
      .eq("id", lead.pessoa_id)
      .maybeSingle();

    const nomeLead = pessoa?.nome ?? lead.titulo ?? "Lead sem nome";

    const html = `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2 style="color:#101828;">⏰ Lead parado há ${dias} dias</h2>
        <p><strong>${nomeLead}</strong> não tem nenhuma movimentação registrada há ${dias} dias.</p>
        <p>Vale a pena dar um retorno ou registrar um atendimento no CRM.</p>
        <p style="margin-top:20px;color:#64748b;font-size:13px;">Dunna Platform</p>
      </div>
    `;

    // Avisa o master
    if (emailMaster) {
      await enviarEmail(emailMaster, `⏰ Lead parado: ${nomeLead}`, html);
    }

    // Avisa o corretor responsável, se tiver
    if (lead.corretor_id) {
      const { data: corretor } = await supabaseAdmin
        .from("corretores")
        .select("email")
        .eq("id", lead.corretor_id)
        .maybeSingle();

      if (corretor?.email && corretor.email !== emailMaster) {
        await enviarEmail(corretor.email, `⏰ Lead parado: ${nomeLead}`, html);
      }
    }

    await supabaseAdmin
      .from("oportunidades")
      .update({ ultimo_alerta_enviado: new Date().toISOString() })
      .eq("id", lead.id);

    avisados++;
  }

  return NextResponse.json({ ok: true, avisados });
}

async function enviarEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dunna Platform <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de lead parado:", error);
  }
}
