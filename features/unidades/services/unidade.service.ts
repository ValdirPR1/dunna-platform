import { supabase } from "@/lib/supabase";
import { Corretor, EmpreendimentoResumo, Unidade, UnidadeFoto } from "../types/unidade";

export async function listarEmpreendimentosResumo(): Promise<
  EmpreendimentoResumo[]
> {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("id, nome, cidade, bairro, latitude, longitude")
    .order("nome");

  if (error) throw error;
  return (data ?? []) as EmpreendimentoResumo[];
}

export async function listarCorretoresAtivos(): Promise<Corretor[]> {
  const { data, error } = await supabase
    .from("corretores")
    .select("id, nome, telefone, email, creci, ativo")
    .eq("ativo", true)
    .order("nome");

  if (error) throw error;
  return (data ?? []) as Corretor[];
}

export async function listarUnidades(empreendimentoId: string) {
  const { data, error } = await supabase
    .from("unidades")
    .select("*")
    .eq("empreendimento_id", empreendimentoId)
    .order("numero");

  if (error) throw error;
  return data ?? [];
}

export interface NovaUnidadeInput {
  empreendimento_id: string;
  torre: string;
  bloco: string;
  andar: string;
  numero: string;
  tipologia: string;
  quartos: string;
  suites: string;
  vagas: string;
  area: string;
  preco: string;
  comissao: string;
  status: string;
  corretor_id: string;
}

export async function criarUnidade(form: NovaUnidadeInput): Promise<Unidade> {
  const { data, error } = await supabase
    .from("unidades")
    .insert({
      empreendimento_id: form.empreendimento_id || null,
      torre: form.torre || null,
      bloco: form.bloco || null,
      andar: form.andar ? Number(form.andar) : null,
      numero: form.numero,
      tipologia: form.tipologia || null,
      quartos: form.quartos ? Number(form.quartos) : null,
      suites: form.suites ? Number(form.suites) : null,
      vagas: form.vagas ? Number(form.vagas) : null,
      area: form.area ? Number(form.area) : null,
      preco: form.preco ? Number(form.preco) : null,
      comissao: form.comissao ? Number(form.comissao) : null,
      status: form.status || "Disponível",
      corretor_id: form.corretor_id || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Unidade;
}

export async function excluirUnidade(id: string) {
  const { error } = await supabase.from("unidades").delete().eq("id", id);
  if (error) throw error;
}

// Envia um arquivo para o bucket "unidades" e devolve a URL pública.
export async function uploadFotoUnidade(
  unidadeId: string,
  file: File
): Promise<string> {
  const caminho = `${unidadeId}/${Date.now()}-${file.name}`;

  const { error: erroUpload } = await supabase.storage
    .from("unidades")
    .upload(caminho, file);

  if (erroUpload) throw erroUpload;

  const { data } = supabase.storage.from("unidades").getPublicUrl(caminho);

  return data.publicUrl;
}

export async function salvarFotoUnidade(
  unidadeId: string,
  url: string,
  ordem: number,
  capa: boolean
) {
  const { error } = await supabase.from("unidade_fotos").insert({
    unidade_id: unidadeId,
    url,
    ordem,
    capa,
  });

  if (error) throw error;
}

export async function listarFotosUnidade(
  unidadeId: string
): Promise<UnidadeFoto[]> {
  const { data, error } = await supabase
    .from("unidade_fotos")
    .select("*")
    .eq("unidade_id", unidadeId)
    .order("ordem");

  if (error) return [];
  return (data ?? []) as UnidadeFoto[];
}
