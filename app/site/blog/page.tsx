export const revalidate = 300;

import type { Metadata } from "next";
import { listarPostsPublicados } from "@/features/blog/services/blog.service";
import BlogListaConteudo from "@/features/site/components/BlogListaConteudo";

export const metadata: Metadata = {
  title: "Blog | Mercado imobiliário e novidades | Dunna Imob",
  description:
    "Conteúdo sobre investimento, tendências e tudo que você precisa saber antes de comprar seu imóvel de praia no litoral de Pernambuco.",
  alternates: {
    canonical: "/site/blog",
  },
};

export default async function BlogPage() {
  const posts = await listarPostsPublicados();

  return <BlogListaConteudo posts={posts} />;
}
