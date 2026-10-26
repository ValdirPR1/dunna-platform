import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { enviarPushParaUsuarios } from "@/lib/webPush";

// Resumo diário do Meu CRM: todo dia de manhã manda um push para cada
// pessoa com as tarefas pendentes de hoje e as atrasadas.
export async function GET(request: NextRequest) {
  const segredo = request.headers.get("authorization");
  if (segredo !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // "Hoje" no fuso de Recife (UTC-3, sem horário de verão)
  const agora = new Date();
  const recife = new Date(agora.getTime() - 3 * 60 * 60 * 1000);
  const fimDoDiaUtc = new Date(
    Date.UTC(recife.getUTCFullYear(), recife.getUTCMonth(), recife.getUTCDate(), 23, 59, 59) +
      3 * 60 * 60 * 1000
  ).toISOString();

  const { data: tarefas, error } = await supabaseAdmin
    .from("meu_crm_tarefas")
    .select("dono_id, titulo, data_hora")
    .eq("concluida", false)
    .lte("data_hora", fimDoDiaUtc);

  if (error) {
    console.error("Erro no resumo do Meu CRM:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const porDono = new Map<string, { hoje: number; atrasadas: number; primeira: string }>();
  const inicioHoje = new Date(fimDoDiaUtc).getTime() - (24 * 60 * 60 * 1000 - 1000);

  for (const t of tarefas ?? []) {
    const info = porDono.get(t.dono_id) ?? { hoje: 0, atrasadas: 0, primeira: t.titulo };
    if (new Date(t.data_hora).getTime() < inicioHoje) info.atrasadas++;
    else info.hoje++;
    porDono.set(t.dono_id, info);
  }

  let avisados = 0;
  for (const [dono, info] of porDono) {
    const partes: string[] = [];
    if (info.hoje) partes.push(`${info.hoje} para hoje`);
    if (info.atrasadas) partes.push(`${info.atrasadas} atrasada${info.atrasadas > 1 ? "s" : ""}`);

    await enviarPushParaUsuarios([dono], {
      titulo: "📋 Meu CRM — tarefas do dia",
      corpo: partes.join(" · "),
      url: "/meu-crm",
    });
    avisados++;
  }

  return NextResponse.json({ ok: true, avisados });
}
