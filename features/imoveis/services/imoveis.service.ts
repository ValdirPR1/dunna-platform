import { supabase } from "@/lib/supabase";
import { Imovel, ImovelFoto } from "../types/imovel";
import { comprimirImagem } from "@/lib/comprimirImagem";
import { sanitizarNomeArquivo } from "@/lib/sanitizarNomeArquivo";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";

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
  const config = await obterConfiguracoes();
  const comMarcaDagua = config.marca_dagua_ativa === "true";

  const arquivoFinal = await comprimirImagem(file, { comMarcaDagua });

  const caminho = `${imovelId}/${Date.now()}-${sanitizarNomeArquivo(arquivoFinal.name)}`;

  const { error: erroUpload } = await supabase.storage
    .from("imoveis")
    .upload(caminho, arquivoFinal);

  if (erroUpload) throw erroUpload;

  const { data } = supabase.storage.from("imoveis").getPublicUrl(caminho);

  return data.publicUrl;
}

// Vídeo do imóvel (um único arquivo por imóvel, guardado direto no
// campo video_url — diferente das fotos, não precisa de tabela própria
// porque não há ordem/capa pra controlar). Sem compressão: vídeo não
// dá pra comprimir no navegador do mesmo jeito que imagem, então o
// arquivo vai como o corretor gravou (o limite de tamanho é validado
// antes, na tela).
export async function uploadVideoImovel(
  imovelId: string,
  file: File
): Promise<string> {
  const caminho = `${imovelId}/video-${Date.now()}-${sanitizarNomeArquivo(file.name)}`;

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

export async function listarCapasPorImoveis(
  imovelIds: string[]
): Promise<Record<string, string>> {
  if (imovelIds.length === 0) return {};

  const { data, error } = await supabase
    .from("imovel_fotos")
    .select("imovel_id, url, capa, ordem")
    .in("imovel_id", imovelIds)
    .order("ordem");

  if (error || !data) return {};

  const capaPorId: Record<string, string> = {};

  for (const foto of data as any[]) {
    if (foto.capa || !capaPorId[foto.imovel_id]) {
      capaPorId[foto.imovel_id] = foto.url;
    }
  }

  return capaPorId;
}
