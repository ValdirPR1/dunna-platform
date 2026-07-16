import { supabase } from "@/lib/supabase";
import { Imovel, ImovelFoto } from "../types/imovel";

export async function listarImoveis(): Promise<Imovel[]> {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Imovel[];
}

export async function buscarImovel(id: string): Promise<Imovel> {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Imovel;
}

function gerarSlug(titulo: string) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function criarImovel(
  payload: Record<string, unknown>
): Promise<Imovel> {
  const { data, error } = await supabase
    .from("imoveis")
    .insert({
      ...payload,
      slug: gerarSlug(String(payload.titulo ?? "")) + "-" + Date.now(),
    })
    .select()
    .single();

  if (error) throw error;

  return data as Imovel;
}

export async function atualizarImovel(
  id: string,
  payload: Record<string, unknown>
): Promise<Imovel> {
  const { data, error } = await supabase
    .from("imoveis")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Imovel;
}

export async function excluirImovel(id: string) {
  const { error } = await supabase.from("imoveis").delete().eq("id", id);
  if (error) throw error;
}

// Fotos (reaproveita a tabela imovel_fotos criada para o site)

export async function uploadFotoImovel(
  imovelId: string,
  file: File
): Promise<string> {
  const caminho = `${imovelId}/${Date.now()}-${file.name}`;

  const { error: erroUpload } = await supabase.storage
    .from("imoveis")
    .upload(caminho, file);

  if (erroUpload) throw erroUpload;

  const { data } = supabase.storage.from("imoveis").getPublicUrl(caminho);

  return data.publicUrl;
}

export async function salvarFotoImovel(
  imovelId: string,
  url: string,
  ordem: number,
  capa: boolean
) {
  const { error } = await supabase.from("imovel_fotos").insert({
    imovel_id: imovelId,
    url,
    ordem,
    capa,
  });

  if (error) throw error;
}

export async function listarFotosImovel(
  imovelId: string
): Promise<ImovelFoto[]> {
  const { data, error } = await supabase
    .from("imovel_fotos")
    .select("*")
    .eq("imovel_id", imovelId)
    .order("ordem");

  if (error) return [];

  return (data ?? []) as ImovelFoto[];
}

export async function atualizarFotoImovel(
  id: string,
  dados: { ordem?: number; capa?: boolean }
) {
  const { error } = await supabase
    .from("imovel_fotos")
    .update(dados)
    .eq("id", id);

  if (error) throw error;
}

export async function excluirFotoImovel(id: string) {
  const { error } = await supabase
    .from("imovel_fotos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
