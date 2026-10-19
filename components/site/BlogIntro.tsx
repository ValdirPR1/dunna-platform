"use client";

import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import TituloSecao from "./TituloSecao";

export default function BlogIntro() {
  const { t } = useIdioma();

  return (
    <div className="mb-14 flex items-end justify-between">

      <TituloSecao tag={t.blog.tag} titulo={t.blog.titulo} />

      <Link
        href="/site/blog"
        className="rotulo-luxo hidden shrink-0 border-b border-navy pb-2 text-navy transition hover:border-gold hover:text-gold-dark md:block"
      >
        {t.blog.verTodos.replace(" →", "")} →
      </Link>

    </div>
  );
}
