"use client";

import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function BlogIntro() {
  const { t } = useIdioma();

  return (
    <div className="mb-14 flex items-end justify-between">

      <div>
        <span className="font-sans font-semibold text-gold">
          {t.blog.tag}
        </span>
        <h2 className="mt-3 max-w-xl break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
          {t.blog.titulo}
        </h2>
      </div>

      <Link
        href="/site/blog"
        className="hidden font-sans font-semibold text-gold hover:underline md:block"
      >
        {t.blog.verTodos}
      </Link>

    </div>
  );
}
