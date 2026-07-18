import { supabase } from "@/lib/supabase";
import { comprimirImagem } from "@/lib/comprimirImagem";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";

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
  url: string,
  ordem = 0,
  capa = false
) {
  const { data, error } = await supabase
    .from("empreendimento_imagens")
    .insert({
      empreendimento_id: empreendimentoId,
      url,
      ordem,
      capa,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarImagem(
  id: string,
  dados: { ordem?: number; capa?: boolean }
) {
  const { error } = await supabase
    .from("empreendimento_imagens")
    .update(dados)
    .eq("id", id);

  if (error) throw error;
}

export async function uploadImagem(
  empreendimentoId: string,
  file: File,
  ordem = 0,
  capa = false
) {
  const config = await obterConfiguracoes();
  const comMarcaDagua = config.marca_dagua_ativa === "true";

  const arquivoFinal = await comprimirImagem(file, { comMarcaDagua });

  const extensao = arquivoFinal.name.split(".").pop();

  const nomeArquivo =
    `${empreendimentoId}/${crypto.randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from("empreendimentos")
    .upload(nomeArquivo, arquivoFinal);

  if (error) throw error;

  const { data } = supabase.storage
    .from("empreendimentos")
    .getPublicUrl(nomeArquivo);

  await salvarImagem(
    empreendimentoId,
    data.publicUrl,
    ordem,
    capa
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

export async function listarCapasPorEmpreendimentos(
  empreendimentoIds: string[]
): Promise<Record<string, string>> {
  if (empreendimentoIds.length === 0) return {};

  const { data, error } = await supabase
    .from("empreendimento_imagens")
    .select("empreendimento_id, url, capa, ordem")
    .in("empreendimento_id", empreendimentoIds)
    .order("ordem");

  if (error || !data) return {};

  const capaPorId: Record<string, string> = {};

  for (const img of data as any[]) {
    // Prioriza a foto marcada como capa; se não tiver, usa a primeira
    if (img.capa || !capaPorId[img.empreendimento_id]) {
      capaPorId[img.empreendimento_id] = img.url;
    }
  }

  return capaPorId;
}