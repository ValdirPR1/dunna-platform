import { supabase } from "@/lib/supabase";
import { EmpreendimentoSite } from "../types/empreendimento";

// Busca a URL da imagem de capa de cada empreendimento na tabela
// empreendimento_imagens. Aceita tanto a coluna "imagem" quanto "url",
// já que o projeto usa nomes diferentes em partes distintas do código.
async function anexarFotosCapa(
  empreendimentos: EmpreendimentoSite[]
): Promise<EmpreendimentoSite[]> {
  if (empreendimentos.length === 0) return empreendimentos;

  const ids = empreendimentos.map((e) => e.id);

  const { data: imagens, error } = await supabase
    .from("empreendimento_imagens")
    .select("*")
    .in("empreendimento_id", ids)
    .eq("capa", true);

  if (error || !imagens) {
    return empreendimentos;
  }

  const capaPorId = new Map<string, string>();
  for (const img of imagens as any[]) {
    const url = img.imagem ?? img.url;
    if (url) capaPorId.set(img.empreendimento_id, url);
  }

  return empreendimentos.map((e) => ({
    ...e,
    fotoCapa: capaPorId.get(e.id) ?? null,
  }));
}

export async function getFeaturedEmpreendimentos(): Promise<
  EmpreendimentoSite[]
> {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .eq("publicado", true)
    .order("criando_em", { ascending: false })
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
    .order("criando_em", { ascending: false });

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
