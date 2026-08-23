import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { criarEventoNoGoogle } from "@/features/agenda/services/googleCalendarApi";

// Sincroniza de uma vez todas as tarefas do corretor que ainda não
// têm um evento correspondente no Google (google_event_id vazio) —
// serve tanto pra "resgatar" tarefas criadas antes da conexão ter
// sido corrigida quanto pra qualquer uma que tenha falhado no
// caminho (ex.: token expirado num momento específico).
export async function POST(request: NextRequest) {
  try {
    const { corretorId } = await request.json();

    if (!corretorId) {
      return NextResponse.json({ ok: false, erro: "corretorId ausente" }, { status: 400 });
    }

    const { data: tarefas, error } = await supabaseAdmin
      .from("tarefas")
      .select("id, tipo, titulo, data_hora, observacoes, concluida")
      .eq("corretor_id", corretorId)
      .is("google_event_id", null);

    if (error) {
      return NextResponse.json({ ok: false, erro: error.message }, { status: 500 });
    }

    const pendentes = (tarefas ?? []).filter((t) => !t.concluida);

    let sincronizadas = 0;
    let falhas = 0;
    let ultimoErro = "";

    // Uma de cada vez (não em paralelo) pra não estourar o limite de
    // requisições por segundo da API do Google quando há muitas
    // tarefas acumuladas.
    for (const tarefa of pendentes) {
      const resultado = await criarEventoNoGoogle(corretorId, {
        titulo: `${tarefa.tipo}: ${tarefa.titulo}`,
        descricao: tarefa.observacoes ?? "",
        dataHoraInicio: tarefa.data_hora,
      });

      if (resultado.ok) {
        sincronizadas++;
        await supabaseAdmin
          .from("tarefas")
          .update({ google_event_id: resultado.dados })
          .eq("id", tarefa.id);
      } else {
        falhas++;
        ultimoErro = resultado.erro;
        // Se a própria conexão estiver com problema (token inválido/
        // sem permissão), todas as próximas vão falhar do mesmo jeito
        // — para logo em vez de bater na API do Google mais um monte
        // de vezes à toa.
        if (/scope|token|conectada/i.test(resultado.erro)) break;
      }
    }

    return NextResponse.json({
      ok: falhas === 0,
      sincronizadas,
      falhas,
      erro: falhas > 0 ? ultimoErro : undefined,
    });
  } catch (error) {
    console.error("Erro ao sincronizar tudo com Google Agenda:", error);
    return NextResponse.json({ ok: false, erro: "Erro inesperado ao sincronizar." }, { status: 500 });
  }
}
