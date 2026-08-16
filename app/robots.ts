import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

// Só o site público (/site, /lp) deve ser indexado pelo Google. Tudo o
// mais aqui é o sistema interno (CRM), protegido por login — não faz
// sentido pro Google (nem seguro) indexar essas telas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/site",
        "/lp",
        // URLs antigas do site em PHP que redirecionam (301) pro site
        // novo — precisam ficar liberadas pro Google conseguir
        // rastrear e seguir o redirecionamento, senão a página antiga
        // fica "presa" no índice e o posicionamento não passa pra
        // frente (ver next.config.ts → redirects). Sem essas linhas,
        // o bloqueio de /blog, /empreendimentos e /imoveis abaixo
        // também pegaria essas URLs .php por engano.
        "/blog.php",
        "/empreendimentos.php",
        "/imoveis.php",
      ],
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
