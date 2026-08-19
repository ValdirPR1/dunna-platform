"use client";

import { MessageSquarePlus, ExternalLink } from "lucide-react";
import Estrelas from "./Estrelas";
import AvaliacaoCard from "./AvaliacaoCard";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import { AvaliacoesGoogle } from "../services/avaliacoes.service";

interface Props {
  dados: AvaliacoesGoogle;
}

export default function AvaliacoesConteudo({ dados }: Props) {
  const { t } = useIdioma();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      <span className="font-sans font-semibold text-gold">
        {t.avaliacoes.tag}
      </span>

      <h1 className="mt-3 break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {t.avaliacoes.titulo}
      </h1>

      <p className="mt-4 max-w-2xl font-sans text-lg text-slate-500">
        {t.avaliacoes.descricaoPagina}
      </p>

      {!dados.disponivel ? (

        <div className="mt-16 rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            {t.avaliacoes.semAvaliacoes}
          </p>
        </div>

      ) : (

        <>
          <div className="mt-12 flex flex-col items-start gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold text-navy">
                  {dados.notaMedia?.toFixed(1)}
                </span>
                <div>
                  <Estrelas nota={dados.notaMedia ?? 0} />
                  <p className="mt-1 font-sans text-sm text-slate-500">
                    {t.avaliacoes.comBaseEm} {dados.totalAvaliacoes} {t.avaliacoes.avaliacoesNoGoogle}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {dados.linkAvaliar && (
                <a
                  href={dados.linkAvaliar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
                >
                  <MessageSquarePlus size={18} />
                  {t.avaliacoes.deixarAvaliacao}
                </a>
              )}

              {dados.linkGoogle && (
                <a
                  href={dados.linkGoogle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-sans font-semibold text-navy transition hover:border-gold hover:text-gold"
                >
                  {t.avaliacoes.verNoGoogle}
                  <ExternalLink size={16} />
                </a>
              )}

            </div>

          </div>

          {dados.avaliacoes && dados.avaliacoes.length > 0 && (

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {dados.avaliacoes.map((avaliacao, i) => (
                <AvaliacaoCard key={i} avaliacao={avaliacao} />
              ))}

            </div>

          )}
        </>

      )}

    </div>
  );
}
