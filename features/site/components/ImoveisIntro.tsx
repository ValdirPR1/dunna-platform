"use client";

import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function ImoveisIntro({
  semResultado,
  temFiltro,
}: {
  semResultado: boolean;
  temFiltro: boolean;
}) {
  const { t } = useIdioma();

  return (
    <>
      <h1 className="break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {t.imoveis.titulo}
      </h1>

      <p className="mt-4 text-lg text-slate-500">
        {t.imoveis.descricao}
      </p>

      {semResultado && (
        <p className="mt-12 text-slate-500">
          {temFiltro ? t.imoveis.nenhumComFiltro : t.imoveis.nenhumSemFiltro}
        </p>
      )}
    </>
  );
}
