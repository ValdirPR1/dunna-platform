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

// Cria um imóvel de verdade em "Imóveis", aproveitando os dados do
// empreendimento (localização, tipo, descrição) + os dados
// específicos dessa unidade (área, quartos, preço, corretor). Se a
// unidade já tiver fotos próprias, usa elas; senão, aproveita as
// fotos gerais do empreendimento.
export async function criarAnuncioComUnidade(
  unidadeId: string
): Promise<string> {
  const { data: unidade, error: erroUnidade } = await supabase
    .from("unidades")
    .select("*")
    .eq("id", unidadeId)
    .single();

  if (erroUnidade || !unidade) {
    throw erroUnidade ?? new Error("Unidade não encontrada.");
  }

  const { data: empreendimento, error: erroEmpreendimento } = await supabase
    .from("empreendimentos")
    .select("*")
    .eq("id", unidade.empreendimento_id)
    .single();

  if (erroEmpreendimento || !empreendimento) {
    throw erroEmpreendimento ?? new Error("Empreendimento não encontrado.");
  }

  const identificacao = [unidade.torre, unidade.bloco, unidade.numero]
    .filter(Boolean)
    .join(" - ");

  const titulo = `${empreendimento.nome} - Unidade ${identificacao || unidade.numero}`;

  const slug =
    titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString().slice(-6);

  const { data: imovel, error: erroImovel } = await supabase
    .from("imoveis")
    .insert({
      titulo,
      tipo: empreendimento.tipo,
      descricao: empreendimento.descricao,
      endereco: empreendimento.endereco,
      bairro: empreendimento.bairro,
      cidade: empreendimento.cidade,
      quartos: unidade.quartos,
      suites: unidade.suites,
      vagas: unidade.vagas,
      area_privativa: unidade.area,
      preco: unidade.preco,
      comissao: unidade.comissao,
      corretor_id: unidade.corretor_id,
      detalhes: empreendimento.comodidades,
      publicado: false,
      ativo: true,
      slug,
    })
    .select("id")
    .single();

  if (erroImovel || !imovel) {
    throw erroImovel ?? new Error("Não foi possível criar o imóvel.");
  }

  // Prioriza as fotos específicas dessa unidade; se não tiver
  // nenhuma, usa as fotos gerais do empreendimento
  const { data: fotosUnidade } = await supabase
    .from("unidade_fotos")
    .select("url")
    .eq("unidade_id", unidadeId)
    .order("ordem");

  let fotosParaCopiar = (fotosUnidade ?? []).map((f: any) => f.url);

  if (fotosParaCopiar.length === 0) {
    const { data: fotosEmpreendimento } = await supabase
      .from("empreendimento_imagens")
      .select("url")
      .eq("empreendimento_id", empreendimento.id)
      .order("ordem");

    fotosParaCopiar = (fotosEmpreendimento ?? []).map((f: any) => f.url);
  }

  if (fotosParaCopiar.length > 0) {
    const fotosParaInserir = fotosParaCopiar.map((url, i) => ({
      imovel_id: imovel.id,
      url,
      ordem: i,
      capa: i === 0,
    }));

    await supabase.from("imovel_fotos").insert(fotosParaInserir);
  }

  await supabase
    .from("unidades")
    .update({ imovel_id: imovel.id })
    .eq("id", unidadeId);

  return imovel.id;
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
