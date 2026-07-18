import { supabase } from "@/lib/supabase";
import { EmpreendimentoSite, PlantaSite } from "../types/empreendimento";

// Busca as fotos de cada empreendimento na tabela empreendimento_imagens.
// Aceita tanto a coluna "imagem" quanto "url", já que o projeto usa
// nomes diferentes em partes distintas do código.
async function anexarFotosCapa(
  empreendimentos: EmpreendimentoSite[]
): Promise<EmpreendimentoSite[]> {
  if (empreendimentos.length === 0) return empreendimentos;

  const ids = empreendimentos.map((e) => e.id);

  const { data: imagens, error } = await supabase
    .from("empreendimento_imagens")
    .select("*")
    .in("empreendimento_id", ids)
    .order("ordem");

  if (error || !imagens) {
    return empreendimentos;
  }

  const fotosPorId = new Map<string, string[]>();
  const capaPorId = new Map<string, string>();

  for (const img of imagens as any[]) {
    const url = img.imagem ?? img.url;
    if (!url) continue;

    const lista = fotosPorId.get(img.empreendimento_id) ?? [];
    lista.push(url);
    fotosPorId.set(img.empreendimento_id, lista);

    if (img.capa) {
      capaPorId.set(img.empreendimento_id, url);
    }
  }

  return empreendimentos.map((e) => {
    const lista = fotosPorId.get(e.id) ?? [];

    return {
      ...e,
      fotoCapa: capaPorId.get(e.id) ?? lista[0] ?? null,
      fotos: lista,
    };
  });
}

export async function listarPlantasEmpreendimento(
  empreendimentoId: string
): Promise<PlantaSite[]> {
  const { data, error } = await supabase
    .from("empreendimento_plantas")
    .select("id, tipologia, area, preco_a_partir, imagem_url")
    .eq("empreendimento_id", empreendimentoId)
    .order("ordem");

  if (error || !data) return [];

  return data as PlantaSite[];
}

export async function getFeaturedEmpreendimentos(): Promise<
  EmpreendimentoSite[]
> {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error(error);
    return [];
  }

  return anexarFotosCapa(data as EmpreendimentoSite[]);
}

export async function getEmpreendimentos(): Promise<EmpreendimentoSite[]> {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return anexarFotosCapa(data as EmpreendimentoSite[]);
}

export async function getEmpreendimentoBySlug(
  slug: string
): Promise<EmpreendimentoSite | null> {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (error || !data) {
    return null;
  }

  const [comFoto] = await anexarFotosCapa([data as EmpreendimentoSite]);
  return comFoto;
}
