"use client";

import Estrelas from "./Estrelas";
import TextoAuto from "@/features/idioma/TextoAuto";
import { AvaliacaoGoogle } from "../services/avaliacoes.service";

interface Props {
  avaliacao: AvaliacaoGoogle;
  // Limita o comentário a 4 linhas — usado no teaser resumido da Home,
  // desligado na página completa de avaliações.
  clamp?: boolean;
}

// Cartão de uma avaliação do Google — usado tanto no teaser da Home
// quanto na página completa de avaliações. O comentário e o "há X
// meses" vêm prontos do Google em português, então passam pela
// tradução automática igual à descrição de imóvel/empreendimento.
export default function AvaliacaoCard({ avaliacao, clamp = false }: Props) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        {avaliacao.fotoAutor ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avaliacao.fotoAutor}
            alt={avaliacao.autor}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-sans font-semibold text-slate-400">
            {avaliacao.autor.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <p className="font-sans font-semibold text-navy">
            {avaliacao.autor}
          </p>
          <TextoAuto
            as="p"
            texto={avaliacao.tempoRelativo}
            className="font-sans text-xs text-slate-400"
          />
        </div>

      </div>

      <div className="mt-3">
        <Estrelas nota={avaliacao.nota} />
      </div>

      <TextoAuto
        as="p"
        texto={avaliacao.texto}
        className={`mt-3 font-sans text-sm text-slate-600 ${clamp ? "line-clamp-4" : ""}`}
      />

    </div>
  );
}
