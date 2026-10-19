"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import TituloSecao from "./TituloSecao";

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.round(nota)
              ? "fill-gold text-gold"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default function AvaliacoesIntro({
  notaMedia,
  totalAvaliacoes,
}: {
  notaMedia: number | null;
  totalAvaliacoes: number | null;
}) {
  const { t } = useIdioma();

  return (
    <div className="mb-14 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">

      <div>
        <TituloSecao tag={t.avaliacoes.tag} titulo={t.avaliacoes.titulo} />

        <div className="mt-6 flex items-center gap-3">
          <span className="font-display text-3xl font-light text-navy">
            {notaMedia?.toFixed(1)}
          </span>
          <Estrelas nota={notaMedia ?? 0} />
          <span className="font-sans text-sm text-slate-500">
            ({totalAvaliacoes} {t.avaliacoes.avaliacoesNoGoogle})
          </span>
        </div>
      </div>

      <Link
        href="/site/avaliacoes"
        className="rotulo-luxo hidden shrink-0 border-b border-navy pb-2 text-navy transition hover:border-gold hover:text-gold-dark md:block"
      >
        {t.avaliacoes.verTodas.replace(" →", "")} →
      </Link>

    </div>
  );
}
