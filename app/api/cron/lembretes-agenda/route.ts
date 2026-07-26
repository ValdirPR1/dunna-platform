import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  enviarPushParaUsuarios,
  idDoUsuarioPorCorretor,
  idsDosMasters,
} from "@/lib/webPush";

// Roda a cada poucos minutos (configurado no vercel.json / ou num
// disparador externo — ver README da feature) verificando tarefas que
// estão perto do horário (ou já passaram há pouco) e ainda não tiveram
// lembrete enviado, mandando um push pro corretor responsável.
export async function GET(request: NextRequest) {
  const segredo = request.headers.get("authorization");
  if (segredo !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const agora = Date.now();
  const vinteMinFrente = new Date(agora + 20 * 60 * 1000).toISOString();
  const duasHorasAtras = new Date(agora - 2 * 60 * 60 * 1000).toISOString();

  const { data: tarefas, error } = await supabaseAdmin
    .from("tarefas")
    .select("id, titulo, data_hora, corretor_id")
    .eq("concluida", false)
    .eq("lembrete_enviado", false)
    .gte("data_hora", duasHorasAtras)
    .lte("data_hora", vinteMinFrente);

  if (error) {
    console.error("Erro ao buscar tarefas pra lembrete:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!tarefas || tarefas.length === 0) {
    return NextResponse.json({ ok: true, avisados: 0 });
  }

  const idsMasters = await idsDosMasters();
  let avisados = 0;

  for (const tarefa of tarefas) {
    const horario = new Date(tarefa.data_hora).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const jaVenceu = new Date(tarefa.data_hora).getTime() <= agora;

    let idsParaPush: string[] = [];

    if (tarefa.corretor_id) {
      const idUsuario = await idDoUsuarioPorCorretor(tarefa.corretor_id);
      idsParaPush = idUsuario ? [idUsuario] : idsMasters;
    } else {
      idsParaPush = idsMasters;
    }

    await enviarPushParaUsuarios(idsParaPush, {
      titulo: jaVenceu ? "⏰ Tarefa atrasada" : "⏰ Tarefa em breve",
      corpo: `${tarefa.titulo} — ${horario}`,
      url: "/agenda",
    });

    await supabaseAdmin
      .from("tarefas")
      .update({ lembrete_enviado: true })
      .eq("id", tarefa.id);

    avisados++;
  }

  return NextResponse.json({ ok: true, avisados });
}
