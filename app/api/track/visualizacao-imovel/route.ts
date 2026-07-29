import { NextRequest, NextResponse } from "next/server";
import { registrarVisualizacao } from "@/features/site/services/visualizacoes.service";

// Registra a visualização de um imóvel no site público. Existe como
// rota separada (chamada pelo navegador do visitante, não durante a
// renderização da página) porque a página do imóvel agora usa cache
// (ISR) pra carregar mais rápido — se a visualização fosse registrada
// durante a renderização, ela só contaria quando a página fosse
// re-gerada (a cada alguns minutos), não uma vez por visitante de
// verdade.
export async function POST(request: NextRequest) {
  let imovelId: string | undefined;

  try {
    const body = await request.json();
    imovelId = body?.imovelId;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!imovelId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await registrarVisualizacao(imovelId);

  return NextResponse.json({ ok: true });
}
