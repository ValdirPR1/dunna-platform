import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { getImoveis } from "@/features/site/services/imoveis.service";
import { getEmpreendimentos } from "@/features/site/services/empreendimentos.service";
import { listarPostsPublicados } from "@/features/blog/services/blog.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginasEstaticas: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/site`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/site/imoveis`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/site/empreendimentos`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/site/blog`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/site/sobre`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/site/contato`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/site/vender`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const [imoveis, empreendimentos, posts] = await Promise.all([
    getImoveis().catch(() => []),
    getEmpreendimentos().catch(() => []),
    listarPostsPublicados().catch(() => []),
  ]);

  const paginasImoveis: MetadataRoute.Sitemap = imoveis
    .filter((i) => i.slug)
    .map((imovel) => ({
      url: `${SITE_URL}/site/imoveis/${imovel.slug}`,
      lastModified: imovel.created_at
        ? new Date(imovel.created_at)
        : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const paginasEmpreendimentos: MetadataRoute.Sitemap = empreendimentos
    .filter((e) => e.slug)
    .map((emp) => ({
      url: `${SITE_URL}/site/empreendimentos/${emp.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const paginasBlog: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug)
    .map((post) => ({
      url: `${SITE_URL}/site/blog/${post.slug}`,
      lastModified: post.created_at ? new Date(post.created_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [
    ...paginasEstaticas,
    ...paginasImoveis,
    ...paginasEmpreendimentos,
    ...paginasBlog,
  ];
}
