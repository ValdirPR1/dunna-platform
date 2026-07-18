import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  criarEventoNoGoogle,
  atualizarEventoNoGoogle,
  excluirEventoNoGoogle,
} from "@/features/agenda/services/googleCalendarApi";

export async function POST(request: NextRequest) {
  try {
    const { tarefaId, acao } = await request.json();

    if (!tarefaId || !acao) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (acao === "excluir") {
      const { data: tarefa } = await supabaseAdmin
        .from("tarefas")
        .select("corretor_id, google_event_id")
        .eq("id", tarefaId)
        .single();

      if (tarefa?.corretor_id && tarefa?.google_event_id) {
        await excluirEventoNoGoogle(tarefa.corretor_id, tarefa.google_event_id);
      }

      return NextResponse.json({ ok: true });
    }

    const { data: tarefa } = await supabaseAdmin
      .from("tarefas")
      .select("*")
      .eq("id", tarefaId)
      .single();

    if (!tarefa || !tarefa.corretor_id) {
      return NextResponse.json({ ok: true });
    }

    // Confirma se esse corretor tem a Google Agenda conectada
    const { data: conexao } = await supabaseAdmin
      .from("google_agenda_conexoes")
      .select("corretor_id")
      .eq("corretor_id", tarefa.corretor_id)
      .single();

    if (!conexao) {
      return NextResponse.json({ ok: true, motivo: "nao_conectado" });
    }

    const dadosEvento = {
      titulo: `${tarefa.tipo}: ${tarefa.titulo}`,
      descricao: tarefa.observacoes ?? "",
      dataHoraInicio: tarefa.data_hora,
    };

    if (tarefa.google_event_id) {
      await atualizarEventoNoGoogle(
        tarefa.corretor_id,
        tarefa.google_event_id,
        dadosEvento
      );
    } else {
      const eventId = await criarEventoNoGoogle(
        tarefa.corretor_id,
        dadosEvento
      );

      if (eventId) {
        await supabaseAdmin
          .from("tarefas")
          .update({ google_event_id: eventId })
          .eq("id", tarefaId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao sincronizar com Google Agenda:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
