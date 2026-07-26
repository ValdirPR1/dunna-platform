import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

// Só o site público (/site, /lp) deve ser indexado pelo Google. Tudo o
// mais aqui é o sistema interno (CRM), protegido por login — não faz
// sentido pro Google (nem seguro) indexar essas telas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/site", "/lp"],
      disallow: [
        "/dashboard",
        "/crm",
        "/agenda",
        "/configuracoes",
        "/financeiro",
        "/login",
        "/api",
        "/auth",
        "/advisor",
        "/corretores",
        "/contratos",
        "/captacoes",
        "/propostas",
        "/marketing",
        "/landing-pages",
        "/unidades",
        "/blog",
        "/empreendimentos",
        "/imoveis",
        "/ui",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
