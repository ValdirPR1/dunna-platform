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
      <span className="rotulo-luxo flex items-center text-gold-dark">
        <span className="fio-luxo" />
        {t.home.tag}
      </span>

      <h1 className="mt-5 break-words font-display text-5xl text-navy lg:text-6xl">
        {t.imoveis.titulo}
      </h1>

      <p className="mt-5 max-w-2xl font-sans text-lg font-light leading-8 text-slate-500">
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
