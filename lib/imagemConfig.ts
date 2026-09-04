// No plano Hobby da Vercel, a otimização automática de imagem (aquela
// que redimensiona/comprime as fotos dos imóveis via /_next/image)
// tem uma cota mensal de transformações bem baixa. Depois que ela
// estourava, a Vercel passava a devolver erro 402 pra qualquer foto
// nova que ainda não tinha sido otimizada antes — foi isso que fez a
// foto de capa do "Mana Beach" sumir do site na época.
//
// Migramos pro plano Pro (a cota subiu bastante), então a otimização
// está ligada de novo — deixa "false". Se algum dia voltar pro Hobby
// (ou a cota do Pro passar a estourar com o catálogo maior), muda
// essa flag pra "true": ela desliga a otimização só nas fotos que
// vêm do Supabase Storage (imóveis, empreendimentos, galerias,
// plantas), que passam a carregar do jeito que foram enviadas, sem
// bater na cota — sem precisar mexer em mais nenhum lugar do código.
export const SEM_OTIMIZACAO_IMAGEM = false;
