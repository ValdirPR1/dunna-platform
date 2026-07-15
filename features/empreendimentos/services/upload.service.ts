import { supabase } from "@/lib/supabase";

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

  return data.publicUrl;
}