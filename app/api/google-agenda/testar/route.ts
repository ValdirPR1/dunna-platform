import { NextRequest, NextResponse } from "next/server";
import {
  criarEventoNoGoogle,
  excluirEventoNoGoogle,
} from "@/features/agenda/services/googleCalendarApi";

// Cria um evento de teste na Google Agenda do corretor agora mesmo e
// apaga em seguida — serve só pra confirmar, na hora, se a conexão
// realmente está funcionando (em vez de esperar a próxima tarefa criada
// e descobrir só depois que nada apareceu na agenda).
export async function POST(request: NextRequest) {
  try {
    const { corretorId } = await request.json();

    if (!corretorId) {
      return NextResponse.json({ ok: false, erro: "corretorId ausente" }, { status: 400 });
    }

    const resultado = await criarEventoNoGoogle(corretorId, {
      titulo: "Teste de conexão — Dunna Platform",
      descricao: "Este evento foi criado só pra testar a sincronização e já foi removido.",
      dataHoraInicio: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    if (!resultado.ok) {
      return NextResponse.json({ ok: false, erro: resultado.erro });
    }

    // Limpa o evento de teste — não queremos deixar lixo na agenda de
    // ninguém. Se a exclusão falhar por algum motivo, não é grave (o
    // corretor pode apagar manualmente), então não derruba o teste.
    await excluirEventoNoGoogle(corretorId, resultado.dados);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao testar conexão com Google Agenda:", error);
    return NextResponse.json({ ok: false, erro: "Erro inesperado ao testar." }, { status: 500 });
  }
}
