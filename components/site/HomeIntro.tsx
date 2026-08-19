"use client";

import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function HomeIntro() {
  const { t } = useIdioma();

  return (
    <div className="mx-auto mb-10 max-w-7xl px-6">

      <span className="font-sans font-semibold text-gold">
        {t.home.tag}
      </span>

      <h2 className="mt-3 break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {t.home.titulo}
      </h2>

      <p className="mt-3 max-w-2xl font-sans text-lg text-slate-500">
        {t.home.descricao}
      </p>

    </div>
  );
}
