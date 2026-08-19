"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import TextoAuto from "@/features/idioma/TextoAuto";
import ConteudoHtmlTraduzido from "@/features/idioma/ConteudoHtmlTraduzido";
import { BlogPost } from "@/features/blog/services/blog.service";
import { Idioma } from "@/features/idioma/dicionario";

interface Props {
  post: BlogPost;
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

export default function BlogPostConteudo({ post }: Props) {
  const { t, idioma } = useIdioma();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">

      <Link
        href="/site/blog"
        className="flex items-center gap-2 font-sans text-sm font-semibold text-gold hover:underline"
      >
        <ArrowLeft size={16} />
        {t.blogPagina.voltarBlog}
      </Link>

      {post.categoria && (
        <TextoAuto
          as="span"
          texto={post.categoria}
          className="mt-8 block font-sans text-sm font-semibold uppercase tracking-wide text-gold"
        />
      )}

      <TextoAuto
        as="h1"
        texto={post.titulo}
        className="mt-3 max-w-3xl break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl"
      />

      <p className="mt-4 font-sans text-sm text-slate-400">
        {post.autor} · {formatarData(post.created_at, idioma)}
      </p>

      {post.imagem_capa && (
        <div className="relative mt-10 h-96 w-full overflow-hidden rounded-3xl">
          <Image
            src={post.imagem_capa}
            alt={post.titulo}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            unoptimized={SEM_OTIMIZACAO_IMAGEM}
          />
        </div>
      )}

      <ConteudoHtmlTraduzido
        html={post.conteudo_html}
        className="prose prose-slate mt-10 max-w-none font-sans prose-headings:font-display prose-headings:text-navy prose-a:text-gold"
      />

    </article>
  );
}
