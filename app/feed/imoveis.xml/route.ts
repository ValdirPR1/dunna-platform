import { supabase } from "@/lib/supabase";
import {
  ImovelFeed,
  montarFeedVrsync,
  statusIndisponivel,
} from "@/lib/feeds/vrsync";

// Feed público de imóveis no formato VRSync (padrão Grupo ZAP), usado
// pela Lais pra saber quais imóveis estão disponíveis pra venda e
// oferecer no papo com o lead. Entra aqui todo imóvel "publicado no
// site" — isso vale tanto pros cadastrados direto em Imóveis quanto
// pras unidades de Empreendimentos (que viram um imóvel "de verdade"
// ao serem publicadas, ver criarAnuncioComUnidade). Antes existia uma
// segunda marcação separada ("publicar em portais"), mas como as
// unidades de empreendimentos nunca passavam por essa tela pra
// marcá-la, elas ficavam de fora do feed da Lais mesmo publicadas no
// site — por isso foi unificado num controle só.
//
// URL pública: https://dunnaimob.com.br/feed/imoveis.xml
//
// Documentação do formato: https://developers.grupozap.com/feeds/vrsync/

export async function GET() {
  const { data: imoveis, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("publicado", true);

  if (error) {
    console.error("Erro ao gerar feed VRSync:", error);
    return new Response("Erro ao gerar feed.", { status: 500 });
  }

  const disponiveis = (imoveis ?? []).filter(
    (i: any) => !statusIndisponivel(i.status)
  );

  const ids = disponiveis.map((i: any) => i.id);

  const fotosPorImovel = new Map<string, string[]>();

  if (ids.length > 0) {
    const { data: fotos } = await supabase
      .from("imovel_fotos")
      .select("imovel_id, url, ordem, capa")
      .in("imovel_id", ids)
      .order("ordem");

    for (const foto of (fotos ?? []) as any[]) {
      const lista = fotosPorImovel.get(foto.imovel_id) ?? [];
      if (foto.capa) {
        lista.unshift(foto.url);
      } else {
        lista.push(foto.url);
      }
      fotosPorImovel.set(foto.imovel_id, lista);
    }
  }

  // Um imóvel sem nenhuma foto não pode ser importado (regra do
  // VRSync exige ao menos 1 imagem), então esses ficam de fora do
  // feed até terem foto cadastrada.
  const imoveisFeed: ImovelFeed[] = disponiveis
    .map((i: any) => ({
      id: i.id,
      codigo: i.codigo,
      titulo: i.titulo,
      slug: i.slug,
      tipo: i.tipo,
      status: i.status,
      descricao: i.descricao,
      cidade: i.cidade,
      bairro: i.bairro,
      endereco: i.endereco,
      cep: i.cep,
      preco: i.preco,
      condominio: i.condominio,
      iptu: i.iptu,
      iptu_periodicidade: i.iptu_periodicidade,
      quartos: i.quartos,
      suites: i.suites,
      banheiros: i.banheiros,
      vagas: i.vagas,
      area_privativa: i.area_privativa,
      area_total: i.area_total,
      latitude: i.latitude,
      longitude: i.longitude,
      video_url: i.video_url,
      fotos: fotosPorImovel.get(i.id) ?? [],
    }))
    .filter((i: ImovelFeed) => i.fotos.length > 0);

  const { data: configData } = await supabase
    .from("configuracoes")
    .select("chave, valor");

  const config: Record<string, string> = {};
  for (const item of (configData ?? []) as any[]) {
    if (typeof item.valor === "string") config[item.chave] = item.valor;
  }

  const xml = montarFeedVrsync(imoveisFeed, {
    nomeEmpresa: "Dunna Imob",
    email:
      config.empresa_email ||
      config.email_notificacao_master ||
      "contato@dunnaimob.com.br",
    telefone: config.empresa_whatsapp || "",
    website: "https://dunnaimob.com.br",
    logoUrl: "https://dunnaimob.com.br/logo/dunna-site.png",
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
    },
  });
}
