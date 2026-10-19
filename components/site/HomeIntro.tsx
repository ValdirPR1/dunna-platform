"use client";

import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import TituloSecao from "./TituloSecao";

export default function HomeIntro() {
  const { t } = useIdioma();

  return (
    <div className="mx-auto mb-14 flex pt-24 max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between">

      <TituloSecao
        tag={t.home.tag}
        titulo={t.home.titulo}
        descricao={t.home.descricao}
      />

      <Link
        href="/site/imoveis"
        className="rotulo-luxo shrink-0 border-b border-navy pb-2 text-navy transition hover:border-gold hover:text-gold-dark"
      >
        {t.luxo.verColecao} →
      </Link>

    </div>
  );
}
