export const revalidate = 600;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarPostPorSlug } from "@/features/blog/services/blog.service";
import { SITE_URL } from "@/lib/siteUrl";
import BlogPostConteudo from "@/features/site/components/BlogPostConteudo";

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />

      <BlogPostConteudo post={post} />
    </>
  );
}
