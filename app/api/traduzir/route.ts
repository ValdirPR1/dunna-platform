import { NextRequest, NextResponse } from "next/server";
import { traduzirTexto, traduzirHtml, IdiomaAlvo } from "@/lib/traducao";

// Traduz um texto (ou HTML) vindo do banco pro idioma escolhido no
// site. Chamado pelo navegador quando o visitante troca pra EN/ES —
// por isso é uma rota simples, sem autenticação (não expõe nada que
// já não esteja público na própria página).
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const texto: unknown = body?.texto;
  const idioma: unknown = body?.idioma;
  const html: unknown = body?.html;

  if (typeof texto !== "string" || !texto.trim()) {
    return NextResponse.json({ traduzido: texto ?? "" });
  }

  if (idioma !== "en" && idioma !== "es") {
    return NextResponse.json({ traduzido: texto });
  }

  const traduzido = html
    ? await traduzirHtml(texto, idioma as IdiomaAlvo)
    : await traduzirTexto(texto, idioma as IdiomaAlvo);

  return NextResponse.json({ traduzido });
}
