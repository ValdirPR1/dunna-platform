export const revalidate = 0;

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buscarPostPorSlug } from "@/features/blog/services/blog.service";

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await buscarPostPorSlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">

      <Link
        href="/site/blog"
        className="flex items-center gap-2 font-sans text-sm font-semibold text-gold hover:underline"
      >
        <ArrowLeft size={16} />
        Voltar pro blog
      </Link>

      {post.categoria && (
        <span className="mt-8 block font-sans text-sm font-semibold uppercase tracking-wide text-gold">
          {post.categoria}
        </span>
      )}

      <h1 className="mt-3 font-display text-4xl font-bold text-navy md:text-5xl">
        {post.titulo}
      </h1>

      <p className="mt-4 font-sans text-sm text-slate-400">
        {post.autor} · {formatarData(post.created_at)}
      </p>

      {post.imagem_capa && (
        <img
          src={post.imagem_capa}
          alt={post.titulo}
          className="mt-10 h-96 w-full rounded-3xl object-cover"
        />
      )}

      <div
        className="prose prose-slate mt-10 max-w-none font-sans prose-headings:font-display prose-headings:text-navy prose-a:text-gold"
        dangerouslySetInnerHTML={{ __html: post.conteudo_html ?? "" }}
      />

    </article>
  );
}
