import { supabase } from "@/lib/supabase";
import { Comissao } from "../types/comissao";
import { ContaPagar, Bonificacao } from "../types/admFinanceiro";
import { MovimentoInvestimento } from "../types/investimento";
import { valorRecebidoImobiliaria, valorPagoCorretor } from "./comissoes.service";

export async function obterSaldoInicialCaixa(): Promise<number> {
  const { data, error } = await supabase
    .from("caixa_config")
    .select("saldo_inicial")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return 0;
  return Number(data.saldo_inicial) || 0;
}

export async function salvarSaldoInicialCaixa(valor: number) {
  const { error } = await supabase.from("caixa_config").upsert({
    id: 1,
    saldo_inicial: valor,
    atualizado_em: new Date().toISOString(),
  });

  if (error) throw error;
}

export interface DadosCaixa {
  saldoInicial: number;
  comissoes: Comissao[];
  contas: ContaPagar[];
  bonificacoes: Bonificacao[];
  movimentos: MovimentoInvestimento[];
}

export interface ResumoCaixa {
  saldoInicial: number;
  entradas: number;
  saidas: number;
  aplicado: number;
  resgatado: number;
  saldo: number;
}

// Saldo em caixa acumulado de TODOS os meses (não só o mês atual):
// saldo inicial + comissões já recebidas - contas pagas - repasses
// aos corretores - bonificações - aplicações + resgates.
export function calcularCaixa(dados: DadosCaixa): ResumoCaixa {
  const entradas = dados.comissoes
    .filter((c) => c.status === "definida")
    .reduce((s, c) => s + valorRecebidoImobiliaria(c), 0);

  const saidas =
    dados.contas
      .filter((c) => c.status === "pago")
      .reduce((s, c) => s + c.valor, 0) +
    dados.comissoes
      .filter((c) => c.status === "definida")
      .reduce((s, c) => s + valorPagoCorretor(c), 0) +
    dados.bonificacoes.reduce((s, b) => s + b.valor, 0);

  const aplicado = dados.movimentos
    .filter((m) => m.tipo === "aplicacao")
    .reduce((s, m) => s + m.valor, 0);
  const resgatado = dados.movimentos
    .filter((m) => m.tipo === "resgate")
    .reduce((s, m) => s + m.valor, 0);

  return {
    saldoInicial: dados.saldoInicial,
    entradas,
    saidas,
    aplicado,
    resgatado,
    saldo: dados.saldoInicial + entradas - saidas - aplicado + resgatado,
  };
}
