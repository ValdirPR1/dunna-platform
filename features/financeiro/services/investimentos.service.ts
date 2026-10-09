import { supabase } from "@/lib/supabase";
import {
  Investimento,
  MovimentoInvestimento,
  TipoMovimentoInvestimento,
} from "../types/investimento";

export async function listarInvestimentos(): Promise<Investimento[]> {
  const { data, error } = await supabase
    .from("investimentos")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error || !data) return [];
  return data as Investimento[];
}

export async function listarMovimentosInvestimento(): Promise<
  MovimentoInvestimento[]
> {
  const { data, error } = await supabase
    .from("investimento_movimentos")
    .select("*")
    .order("data", { ascending: false });

  if (error || !data) return [];
  return data as MovimentoInvestimento[];
}

export async function criarInvestimento(
  form: { nome: string; instituicao: string },
  criadoPor: string
) {
  const { error } = await supabase.from("investimentos").insert({
    nome: form.nome,
    instituicao: form.instituicao || null,
    valor_atual: 0,
    criado_por: criadoPor,
  });

  if (error) throw error;
}

// Aplicar tira dinheiro do caixa e soma no valor do investimento;
// resgatar faz o contrário. O valor_atual é ajustado junto pra o
// master não precisar atualizar à mão a cada movimento — só quando
// quiser registrar o rendimento.
export async function registrarMovimento(
  investimento: Investimento,
  form: {
    tipo: TipoMovimentoInvestimento;
    valor: number;
    data: string;
    descricao: string;
  },
  criadoPor: string
) {
  const { error } = await supabase.from("investimento_movimentos").insert({
    investimento_id: investimento.id,
    tipo: form.tipo,
    valor: form.valor,
    data: form.data,
    descricao: form.descricao || null,
    criado_por: criadoPor,
  });

  if (error) throw error;

  const novoValor =
    form.tipo === "aplicacao"
      ? investimento.valor_atual + form.valor
      : Math.max(0, investimento.valor_atual - form.valor);

  const { error: erroValor } = await supabase
    .from("investimentos")
    .update({ valor_atual: novoValor })
    .eq("id", investimento.id);

  if (erroValor) throw erroValor;
}

export async function atualizarValorInvestimento(
  id: string,
  valorAtual: number
) {
  const { error } = await supabase
    .from("investimentos")
    .update({ valor_atual: valorAtual })
    .eq("id", id);

  if (error) throw error;
}

export async function excluirMovimentoInvestimento(id: string) {
  const { error } = await supabase
    .from("investimento_movimentos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function excluirInvestimento(id: string) {
  const { error } = await supabase.from("investimentos").delete().eq("id", id);
  if (error) throw error;
}

export interface ResumoInvestimento {
  aplicado: number;
  resgatado: number;
  // valor_atual + resgatado - aplicado
  rendimento: number;
}

export function resumirInvestimento(
  investimento: Investimento,
  movimentos: MovimentoInvestimento[]
): ResumoInvestimento {
  const meus = movimentos.filter((m) => m.investimento_id === investimento.id);
  const aplicado = meus
    .filter((m) => m.tipo === "aplicacao")
    .reduce((s, m) => s + m.valor, 0);
  const resgatado = meus
    .filter((m) => m.tipo === "resgate")
    .reduce((s, m) => s + m.valor, 0);

  return {
    aplicado,
    resgatado,
    rendimento: investimento.valor_atual + resgatado - aplicado,
  };
}
