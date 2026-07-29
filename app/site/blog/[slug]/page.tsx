export const revalidate = 600;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buscarPostPorSlug } from "@/features/blog/services/blog.service";
import { SITE_URL } from "@/lib/siteUrl";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await buscarPostPorSlug(slug);

  if (!post) {
    return { title: "Artigo não encontrado | Dunna Imob" };
  }

  const descricao = post.resumo?.slice(0, 155) ?? post.titulo;

  return {
    title: `${post.titulo} | Blog Dunna Imob`,
    description: descricao,
    alternates: {
      canonical: `/site/blog/${post.slug}`,
    },
    openGraph: {
      title: post.titulo,
      description: descricao,
      url: `/site/blog/${post.slug}`,
      type: "article",
      images: post.imagem_capa ? [{ url: post.imagem_capa }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await buscarPostPorSlug(slug);

  if (!post) {
    notFound();
  }

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumo ?? undefined,
    image: post.imagem_capa ? [post.imagem_capa] : undefined,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: {
      "@type": post.autor ? "Person" : "Organization",
      name: post.autor ?? "Dunna Imob",
    },
    publisher: {
      "@type": "Organization",
      name: "Dunna Imob",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/dunna-site.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/site/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />

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

      <h1 className="mt-3 max-w-3xl break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {post.titulo}
      </h1>

      <p className="mt-4 font-sans text-sm text-slate-400">
        {post.autor} · {formatarData(post.created_at)}
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
          />
        </div>
      )}

      <div
        className="prose prose-slate mt-10 max-w-none font-sans prose-headings:font-display prose-headings:text-navy prose-a:text-gold"
        dangerouslySetInnerHTML={{ __html: post.conteudo_html ?? "" }}
      />

    </article>
  );
}
