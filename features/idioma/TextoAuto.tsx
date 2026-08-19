"use client";

import { ElementType, HTMLAttributes } from "react";
import { useTraducaoAutomatica } from "./useTraducaoAutomatica";

interface Props extends HTMLAttributes<HTMLElement> {
  texto: string | null | undefined;
  as?: ElementType;
}

// Mostra um texto vindo do banco (descrição de imóvel, texto de
// empreendimento, comentário de avaliação...) já traduzido pro idioma
// escolhido no site. Em português, mostra igual sempre mostrou — só
// entra em ação quando o visitante troca pra EN/ES.
export default function TextoAuto({ texto, as: Tag = "span", ...resto }: Props) {
  const traduzido = useTraducaoAutomatica(texto);
  return <Tag {...resto}>{traduzido}</Tag>;
}
