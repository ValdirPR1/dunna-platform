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
  repeticoes: number; // 1 = não repete, 2 a 12 = gera essa quantidade de parcelas mensais
}

// Quando repeticoes > 1, gera todas as parcelas de uma vez (mesmo valor,
// vencimento avançando um mês por parcela), todas ligadas por um
// grupo_recorrencia — assim dá pra excluir a série inteira depois se precisar.
export async function criarContaPagar(form: ContaPagarInput, criadoPor: string) {
  const repeticoes = Math.min(12, Math.max(1, form.repeticoes || 1));

  if (repeticoes === 1) {
    const { error } = await supabase.from("contas_pagar").insert({
      categoria: form.categoria,
      descricao: form.descricao || null,
      valor: form.valor,
      vencimento: form.vencimento || null,
      criado_por: criadoPor,
    });

    if (error) throw error;
    return;
  }

  const grupoRecorrencia =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  const parcelas = Array.from({ length: repeticoes }).map((_, i) => {
    let vencimento: string | null = null;
    if (form.vencimento) {
      const data = new Date(form.vencimento);
      data.setMonth(data.getMonth() + i);
      vencimento = data.toISOString().slice(0, 10);
    }
    return {
      categoria: form.categoria,
      descricao: form.descricao || null,
      valor: form.valor,
      vencimento,
      criado_por: criadoPor,
      grupo_recorrencia: grupoRecorrencia,
      parcela_atual: i + 1,
      parcela_total: repeticoes,
    };
  });

  const { error } = await supabase.from("contas_pagar").insert(parcelas);
  if (error) throw error;
}

// Exclui as parcelas ainda pendentes de uma série recorrente (preserva
// as que já foram pagas, como histórico).
export async function excluirSerieContaPagar(grupoRecorrencia: string) {
  const { error } = await supabase
    .from("contas_pagar")
    .delete()
    .eq("grupo_recorrencia", grupoRecorrencia)
    .eq("status", "pendente");

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
