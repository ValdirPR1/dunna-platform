import { supabase } from "@/lib/supabase";

export async function listarImagens(
  empreendimentoId: string
) {
  const { data, error } = await supabase
    .from("empreendimento_imagens")
    .select("*")
    .eq("empreendimento_id", empreendimentoId)
    .order("ordem");

  if (error) throw error;

  return data ?? [];
}

export async function salvarImagem(
  empreendimentoId: string,
  url: string
) {
  const { data, error } = await supabase
    .from("empreendimento_imagens")
    .insert({
      empreendimento_id: empreendimentoId,
      url,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function uploadImagem(
  empreendimentoId: string,
  file: File
) {
  const extensao = file.name.split(".").pop();

  const nomeArquivo =
    `${empreendimentoId}/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from("empreendimentos")
    .upload(nomeArquivo, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("empreendimentos")
    .getPublicUrl(nomeArquivo);

  await salvarImagem(
    empreendimentoId,
    data.publicUrl
  );

  return data.publicUrl;
}

export async function excluirImagem(id: string) {
  const { error } = await supabase
    .from("empreendimento_imagens")
    .delete()
    .eq("id", id);

  if (error) throw error;
}