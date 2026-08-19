"use client";

import { useTraducaoAutomatica } from "./useTraducaoAutomatica";

interface Props {
  html: string | null | undefined;
  className?: string;
}

// Corpo de um post do blog (HTML rico, vindo do editor) já traduzido
// pro idioma escolhido — mantém as tags (parágrafos, títulos, listas)
// e só troca o texto de dentro delas.
export default function ConteudoHtmlTraduzido({ html, className }: Props) {
  const traduzido = useTraducaoAutomatica(html, { html: true });
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: traduzido }} />
  );
}
