import { supabase } from "@/lib/supabase";
import { comprimirImagem } from "@/lib/comprimirImagem";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";

export interface Planta {
  id: string;
  empreendimento_id: string;
  tipologia: string;
  area: number | null;
  preco_a_partir: number | null;
  imagem_url: string;
  ordem: number;
}

export async function listarPlantas(
  empreendimentoId: string
): Promise<(Planta & { fotos: { id: string; url: string }[] })[]> {
  const { data, error } = await supabase
    .from("empreendimento_plantas")
    .select("*")
    .eq("empreendimento_id", empreendimentoId)
    .order("ordem");

  if (error || !data || data.length === 0) return [];

  const plantaIds = data.map((p: any) => p.id);

  const { data: fotos } = await supabase
    .from("empreendimento_planta_fotos")
    .select("id, planta_id, url")
    .in("planta_id", plantaIds)
    .order("ordem");

  const fotosPorPlanta = new Map<string, { id: string; url: string }[]>();
  for (const foto of (fotos ?? []) as any[]) {
    const lista = fotosPorPlanta.get(foto.planta_id) ?? [];
    lista.push({ id: foto.id, url: foto.url });
    fotosPorPlanta.set(foto.planta_id, lista);
  }

  return data.map((p: any) => ({
    ...p,
    fotos: fotosPorPlanta.get(p.id) ?? [],
  }));
}

export async function uploadPlanta(
  empreendimentoId: string,
  file: File
): Promise<string> {
  const config = await obterConfiguracoes();
  const comMarcaDagua = config.marca_dagua_ativa === "true";

  const arquivoFinal = await comprimirImagem(file, { comMarcaDagua });

  const extensao = arquivoFinal.name.split(".").pop();
  const nomeArquivo = `plantas/${empreendimentoId}/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from("empreendimentos")
    .upload(nomeArquivo, arquivoFinal);

  if (error) throw error;

  const { data } = supabase.storage
    .from("empreendimentos")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}

export async function salvarPlanta(planta: {
  empreendimento_id: string;
  tipologia: string;
  area: number | null;
  preco_a_partir: number | null;
  imagem_url: string;
  ordem: number;
}): Promise<string> {
  const { data, error } = await supabase
    .from("empreendimento_plantas")
    .insert(planta)
    .select("id")
    .single();

  if (error) throw error;

  return data.id;
}

export async function salvarFotoDaPlanta(
  plantaId: string,
  url: string,
  ordem = 0
) {
  const { error } = await supabase
    .from("empreendimento_planta_fotos")
    .insert({ planta_id: plantaId, url, ordem });

  if (error) throw error;
}

export async function listarFotosDaPlanta(
  plantaId: string
): Promise<{ id: string; url: string }[]> {
  const { data, error } = await supabase
    .from("empreendimento_planta_fotos")
    .select("id, url")
    .eq("planta_id", plantaId)
    .order("ordem");

  if (error || !data) return [];

  return data;
}

export async function atualizarPlanta(
  id: string,
  dados: {
    tipologia?: string;
    area?: number | null;
    preco_a_partir?: number | null;
    imagem_url?: string;
  }
) {
  const { error } = await supabase
    .from("empreendimento_plantas")
    .update(dados)
    .eq("id", id);

  if (error) throw error;
}

export async function excluirFotoDaPlanta(id: string) {
  const { error } = await supabase
    .from("empreendimento_planta_fotos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function excluirPlanta(id: string) {
  const { error } = await supabase
    .from("empreendimento_plantas")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
