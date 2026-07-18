import { supabase } from "@/lib/supabase";

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
): Promise<Planta[]> {
  const { data, error } = await supabase
    .from("empreendimento_plantas")
    .select("*")
    .eq("empreendimento_id", empreendimentoId)
    .order("ordem");

  if (error) return [];

  return data as Planta[];
}

export async function uploadPlanta(
  empreendimentoId: string,
  file: File
): Promise<string> {
  const extensao = file.name.split(".").pop();
  const nomeArquivo = `plantas/${empreendimentoId}/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from("empreendimentos")
    .upload(nomeArquivo, file);

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
}) {
  const { error } = await supabase
    .from("empreendimento_plantas")
    .insert(planta);

  if (error) throw error;
}

export async function excluirPlanta(id: string) {
  const { error } = await supabase
    .from("empreendimento_plantas")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
