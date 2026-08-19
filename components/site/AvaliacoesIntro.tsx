"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useIdioma } from "@/features/idioma/IdiomaContext";

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
        <span className="font-sans font-semibold text-gold">
          {t.avaliacoes.tag}
        </span>

        <h2 className="mt-3 max-w-xl break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
          {t.avaliacoes.titulo}
        </h2>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-display text-2xl font-bold text-navy">
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
        className="hidden font-sans font-semibold text-gold hover:underline md:block"
      >
        {t.avaliacoes.verTodas}
      </Link>

    </div>
  );
}
