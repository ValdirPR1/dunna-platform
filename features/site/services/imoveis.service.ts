import { supabase } from "@/lib/supabase";
import { CorretorSite, ImovelImagem, ImovelSite } from "../types/imovel";

async function anexarFotosCapa(
  imoveis: ImovelSite[]
): Promise<ImovelSite[]> {
  if (imoveis.length === 0) return imoveis;

  const ids = imoveis.map((i) => i.id);

  const { data: fotos, error } = await supabase
    .from("imovel_fotos")
    .select("*")
    .in("imovel_id", ids)
    .eq("capa", true);

  if (error || !fotos) {
    return imoveis;
  }

  const capaPorId = new Map<string, string>();
  for (const foto of fotos as any[]) {
    capaPorId.set(foto.imovel_id, foto.url);
  }

  return imoveis.map((i) => ({
    ...i,
    foto_capa: capaPorId.get(i.id) ?? null,
  }));
}

export async function getFeaturedProperties(): Promise<ImovelSite[]> {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error(error);
    return [];
  }

  return anexarFotosCapa(data as ImovelSite[]);
}

export async function getImoveis(): Promise<ImovelSite[]> {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return anexarFotosCapa(data as ImovelSite[]);
}

export async function getImovelBySlug(
  slug: string
): Promise<ImovelSite | null> {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (error || !data) {
    return null;
  }

  const [comFoto] = await anexarFotosCapa([data as ImovelSite]);
  return comFoto;
}

// Mantido por compatibilidade com quem já importava esse nome.
export const getPropertyBySlug = getImovelBySlug;

// Busca todas as fotos do imóvel (galeria completa da página de detalhe).
export async function getImagensImovel(
  imovelId: string
): Promise<ImovelImagem[]> {
  const { data, error } = await supabase
    .from("imovel_fotos")
    .select("*")
    .eq("imovel_id", imovelId)
    .order("ordem");

  if (error) {
    return [];
  }

  return (data as any[]).map((f) => ({
    id: f.id,
    imovel_id: f.imovel_id,
    url: f.url,
    ordem: f.ordem,
  }));
}

export async function getCorretorImovel(
  corretorId: string
): Promise<CorretorSite | null> {
  const { data, error } = await supabase
    .from("corretores")
    .select("id, nome, telefone, creci, foto")
    .eq("id", corretorId)
    .single();

  if (error || !data) return null;

  return data as CorretorSite;
}
