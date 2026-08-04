import { supabase } from "@/lib/supabase";
import { CategoriaConta, ContaPagar } from "../types/admFinanceiro";

export async function listarContasPagar(): Promise<ContaPagar[]> {
  const { data, error } = await supabase
    .from("contas_pagar")
    .select("*")
    .order("vencimento", { ascending: true, nullsFirst: false });

  if (error || !data) return [];
  return data as ContaPagar[];
}

export interface ContaPagarInput {
  categoria: CategoriaConta;
  descricao: string;
  valor: number;
  vencimento: string;
}

export async function criarContaPagar(form: ContaPagarInput, criadoPor: string) {
  const { error } = await supabase.from("contas_pagar").insert({
    categoria: form.categoria,
    descricao: form.descricao || null,
    valor: form.valor,
    vencimento: form.vencimento || null,
    criado_por: criadoPor,
  });

  if (error) throw error;
}

export async function marcarContaPaga(id: string, pago: boolean) {
  const { error } = await supabase
    .from("contas_pagar")
    .update({
      status: pago ? "pago" : "pendente",
      pago_em: pago ? new Date().toISOString().slice(0, 10) : null,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function excluirContaPagar(id: string) {
  const { error } = await supabase.from("contas_pagar").delete().eq("id", id);
  if (error) throw error;
}

// Copia uma conta recorrente (ex: aluguel) pro mês seguinte, já como
// pendente — evita ter que preencher tudo de novo todo mês.
export async function duplicarContaPagar(conta: ContaPagar, criadoPor: string) {
  let novoVencimento: string | null = null;

  if (conta.vencimento) {
    const data = new Date(conta.vencimento);
    data.setMonth(data.getMonth() + 1);
    novoVencimento = data.toISOString().slice(0, 10);
  }

  const { error } = await supabase.from("contas_pagar").insert({
    categoria: conta.categoria,
    descricao: conta.descricao,
    valor: conta.valor,
    vencimento: novoVencimento,
    criado_por: criadoPor,
  });

  if (error) throw error;
}
