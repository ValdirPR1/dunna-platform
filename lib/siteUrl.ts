// URL pública do site — usada no sitemap, robots.txt, metadados (OG,
// canonical) e dados estruturados. Se você configurar um domínio
// próprio na Vercel, isso já atualiza sozinho (usa a variável que a
// própria Vercel injeta), sem precisar mexer em nada aqui. Só defina
// NEXT_PUBLIC_SITE_URL manualmente se quiser forçar um valor fixo.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
