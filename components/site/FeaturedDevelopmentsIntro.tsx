"use client";

import { useIdioma } from "@/features/idioma/IdiomaContext";
import TituloSecao from "./TituloSecao";

export default function FeaturedDevelopmentsIntro() {
  const { t } = useIdioma();

  return (
    <div className="mb-14">

      <TituloSecao tag={t.lancamentos.tag} titulo={t.lancamentos.titulo} />

    </div>
  );
}
