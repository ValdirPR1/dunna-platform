import { NextRequest, NextResponse } from "next/server";
import {
  enviarPushParaUsuarios,
  idDoUsuarioPorCorretor,
  idsDosMasters,
} from "@/lib/webPush";

// Rota chamada pelo próprio app (client-side) toda vez que precisa
// avisar alguém na hora — hoje: novo lead (avisa o master) e lead
// atribuído a um corretor (avisa o corretor). Os crons (lead parado,
// lembrete de tarefa) chamam enviarPushParaUsuarios direto, sem passar
// por essa rota, já que já rodam no servidor.
export async function POST(request: NextRequest) {
  try {
    const { destino, titulo, corpo, url } = await request.json();

    if (!destino || !titulo || !corpo) {
      return NextResponse.json(
        { error: "Faltam dados pra enviar a notificação." },
        { status: 400 }
      );
    }

    let usuarioIds: string[] = [];

    if (destino.tipo === "usuario" && destino.usuarioId) {
      usuarioIds = [destino.usuarioId];
    } else if (destino.tipo === "papel" && destino.papel) {
      usuarioIds = destino.papel === "master" ? await idsDosMasters() : [];
    } else if (destino.tipo === "corretor" && destino.corretorId) {
      const id = await idDoUsuarioPorCorretor(destino.corretorId);
      usuarioIds = id ? [id] : [];
    }

    const resultado = await enviarPushParaUsuarios(usuarioIds, {
      titulo,
      corpo,
      url,
    });

    return NextResponse.json({ ok: true, ...resultado });
  } catch (error) {
    console.error("Erro na rota de notificação push:", error);
    return NextResponse.json(
      { error: "Erro interno ao enviar notificação push." },
      { status: 500 }
    );
  }
}
