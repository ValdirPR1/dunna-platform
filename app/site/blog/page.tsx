export const revalidate = 300;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listarPostsPublicados } from "@/features/blog/services/blog.service";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";

export const metadata: Metadata = {
  title: "Blog | Mercado imobiliário e novidades | Dunna Imob",
  description:
    "Conteúdo sobre investimento, tendências e tudo que você precisa saber antes de comprar seu imóvel de praia no litoral de Pernambuco.",
  alternates: {
    canonical: "/site/blog",
  },
};

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await listarPostsPublicados();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      <span className="font-sans font-semibold text-gold">
        BLOG DUNNA
      </span>

      <h1 className="mt-3 break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        Mercado imobiliário e novidades
      </h1>

      <p className="mt-4 max-w-2xl font-sans text-lg text-slate-500">
        Conteúdo sobre investimento, tendências e tudo que você precisa
        saber antes de comprar seu imóvel de praia.
      </p>

      {posts.length === 0 ? (

        <div className="mt-16 rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Em breve, novos artigos por aqui.
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
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-gold">
                    {post.categoria}
                  </span>
                )}

                <h2 className="mt-2 font-display text-xl font-bold text-navy">
                  {post.titulo}
                </h2>

                {post.resumo && (
                  <p className="mt-2 font-sans text-slate-500 line-clamp-2">
                    {post.resumo}
                  </p>
                )}

                <p className="mt-4 font-sans text-xs text-slate-400">
                  {formatarData(post.created_at)}
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}
