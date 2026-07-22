import { supabase } from "@/lib/supabase";
import { comprimirImagem } from "@/lib/comprimirImagem";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";

export const STATUS_CAPTACAO = [
  "Em avaliação",
  "Aguardando decisão do proprietário",
  "Aprovado",
  "Recusado",
  "Convertido em anúncio",
] as const;

export interface Captacao {
  id: string;
  titulo: string | null;
  tipo: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  area_privativa: number | null;
  proprietario_nome: string | null;
  proprietario_telefone: string | null;
  proprietario_email: string | null;
  valor_pretendido: number | null;
  condicoes: string | null;
  observacoes: string | null;
  status: string;
  corretor_id: string | null;
  data_vistoria: string | null;
  imovel_id: string | null;
  detalhes: string[] | null;
  motivo_venda: string | null;
  documentacao_status: string | null;
  documentacao_observacao: string | null;
  aceita_permuta: boolean;
  valor_minimo_aceito: number | null;
  tem_inquilino: boolean;
  inquilino_ate: string | null;
  exclusividade: boolean;
  exclusividade_ate: string | null;
  origem_captacao: string | null;
  created_at: string;
}

export async function listarCaptacoes(): Promise<Captacao[]> {
  const { data, error } = await supabase
    .from("captacoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Captacao[];
}

export async function buscarCaptacao(id: string): Promise<Captacao | null> {
  const { data, error } = await supabase
    .from("captacoes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Captacao;
}

export async function criarCaptacao(dados: Partial<Captacao>) {
  const { data, error } = await supabase
    .from("captacoes")
    .insert(dados)
    .select()
    .single();

  if (error) throw error;
  return data as Captacao;
}

export async function atualizarCaptacao(id: string, dados: Partial<Captacao>) {
  const { error } = await supabase
    .from("captacoes")
    .update(dados)
    .eq("id", id);

  if (error) throw error;
}

export async function excluirCaptacao(id: string) {
  const { error } = await supabase.from("captacoes").delete().eq("id", id);
  if (error) throw error;
}

export async function listarFotosCaptacao(captacaoId: string) {
  const { data, error } = await supabase
    .from("captacao_fotos")
    .select("*")
    .eq("captacao_id", captacaoId)
    .order("ordem");

  if (error || !data) return [];
  return data as { id: string; url: string; ordem: number }[];
}

export async function uploadFotoCaptacao(
  captacaoId: string,
  file: File,
  ordem = 0
) {
  const config = await obterConfiguracoes();
  const comMarcaDagua = config.marca_dagua_ativa === "true";

  const arquivoFinal = await comprimirImagem(file, { comMarcaDagua });

  const caminho = `${captacaoId}/${Date.now()}-${arquivoFinal.name}`;

  const { error: erroUpload } = await supabase.storage
    .from("captacoes")
    .upload(caminho, arquivoFinal);

  if (erroUpload) throw erroUpload;

  const { data } = supabase.storage.from("captacoes").getPublicUrl(caminho);

  const { error: erroInsert } = await supabase.from("captacao_fotos").insert({
    captacao_id: captacaoId,
    url: data.publicUrl,
    ordem,
  });

  if (erroInsert) throw erroInsert;

  return data.publicUrl;
}

export async function excluirFotoCaptacao(id: string) {
  const { error } = await supabase
    .from("captacao_fotos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Converte a captação num imóvel de verdade, reaproveitando todos os
// dados já preenchidos na vistoria (inclusive as fotos)
export async function converterEmAnuncio(captacaoId: string): Promise<string> {
  const captacao = await buscarCaptacao(captacaoId);
  if (!captacao) throw new Error("Captação não encontrada.");

  const fotos = await listarFotosCaptacao(captacaoId);

  const slug =
    (captacao.titulo || "imovel")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString().slice(-6);

  const { data: imovel, error } = await supabase
    .from("imoveis")
    .insert({
      titulo: captacao.titulo,
      tipo: captacao.tipo,
      descricao: captacao.condicoes,
      endereco: captacao.endereco,
      bairro: captacao.bairro,
      cidade: captacao.cidade,
      quartos: captacao.quartos,
      suites: captacao.suites,
      banheiros: captacao.banheiros,
      vagas: captacao.vagas,
      area_privativa: captacao.area_privativa,
      preco: captacao.valor_pretendido,
      corretor_id: captacao.corretor_id,
      detalhes: captacao.detalhes,
      publicado: false,
      ativo: true,
      slug,
    })
    .select("id")
    .single();

  if (error || !imovel) throw error ?? new Error("Não foi possível criar o imóvel.");

  // Copia as fotos da captação pro imóvel (mesmas URLs, sem reenviar)
  if (fotos.length > 0) {
    const fotosParaInserir = fotos.map((foto, i) => ({
      imovel_id: imovel.id,
      url: foto.url,
      ordem: i,
      capa: i === 0,
    }));

    await supabase.from("imovel_fotos").insert(fotosParaInserir);
  }

  await atualizarCaptacao(captacaoId, {
    status: "Convertido em anúncio",
    imovel_id: imovel.id,
  });

  return imovel.id;
}
