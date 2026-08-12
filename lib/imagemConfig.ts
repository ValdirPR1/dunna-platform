// Enquanto o projeto estiver no plano Hobby da Vercel, a otimização
// automática de imagem (aquela que redimensiona/comprime as fotos
// dos imóveis via /_next/image) tem uma cota mensal de transformações
// bem baixa. Depois que ela estoura, a Vercel passa a devolver erro
// 402 pra qualquer foto nova que ainda não tinha sido otimizada antes
// — foi isso que fez a foto de capa do "Mana Beach" (e vai fazer
// outras fotos novas) sumir do site.
//
// Enquanto isso não muda de plano, essa flag desliga a otimização só
// nas fotos que vêm do Supabase Storage (imóveis, empreendimentos,
// galerias, plantas) — elas passam a carregar do jeito que foram
// enviadas, sem redimensionar/comprimir no servidor da Vercel, então
// nunca mais batem nessa cota.
//
// Assim que migrar pro plano Pro da Vercel (cota de otimização sobe
// bastante), volte essa constante pra "false" — as fotos passam a ser
// otimizadas de novo automaticamente, sem precisar mexer em mais
// nenhum lugar do código.
export const SEM_OTIMIZACAO_IMAGEM = true;
