"use client";

import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function FeaturedDevelopmentsIntro() {
  const { t } = useIdioma();

  return (
    <div className="mb-12">

      <span className="font-sans font-semibold text-gold">
        {t.lancamentos.tag}
      </span>

      <h2 className="mt-3 max-w-3xl break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {t.lancamentos.titulo}
      </h2>

    </div>
  );
}
