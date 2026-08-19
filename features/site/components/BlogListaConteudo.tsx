"use client";

import Image from "next/image";
import Link from "next/link";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import TextoAuto from "@/features/idioma/TextoAuto";
import { BlogPost } from "@/features/blog/services/blog.service";
import { Idioma } from "@/features/idioma/dicionario";

interface Props {
  posts: BlogPost[];
}

const LOCALE_POR_IDIOMA: Record<Idioma, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

function formatarData(data: string, idioma: Idioma) {
  return new Date(data).toLocaleDateString(LOCALE_POR_IDIOMA[idioma], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogListaConteudo({ posts }: Props) {
  const { t, idioma } = useIdioma();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      <span className="font-sans font-semibold text-gold">
        {t.blogPagina.tag}
      </span>

      <h1 className="mt-3 break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {t.blogPagina.titulo}
      </h1>

      <p className="mt-4 max-w-2xl font-sans text-lg text-slate-500">
        {t.blogPagina.descricao}
      </p>

      {posts.length === 0 ? (

        <div className="mt-16 rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            {t.blogPagina.semArtigos}
          </p>
        </div>

      ) : (

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {posts.map((post) => (

            <Link
              key={post.id}
              href={`/site/blog/${post.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-100 shadow-sm transition hover:shadow-lg"
            >

              {post.imagem_capa && (
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={post.imagem_capa}
                    alt={post.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={SEM_OTIMIZACAO_IMAGEM}
                  />
                </div>
              )}

              <div className="p-6">

                {post.categoria && (
                  <TextoAuto
                    as="span"
                    texto={post.categoria}
                    className="font-sans text-xs font-semibold uppercase tracking-wide text-gold"
                  />
                )}

                <TextoAuto
                  as="h2"
                  texto={post.titulo}
                  className="mt-2 font-display text-xl font-bold text-navy"
                />

                {post.resumo && (
                  <TextoAuto
                    as="p"
                    texto={post.resumo}
                    className="mt-2 line-clamp-2 font-sans text-slate-500"
                  />
                )}

                <p className="mt-4 font-sans text-xs text-slate-400">
                  {formatarData(post.created_at, idioma)}
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}
