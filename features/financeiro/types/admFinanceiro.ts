export type CategoriaConta =
  | "luz"
  | "internet"
  | "aluguel"
  | "condominio"
  | "taxas"
  | "impostos"
  | "outros";

export const CATEGORIAS_CONTA: { valor: CategoriaConta; label: string }[] = [
  { valor: "luz", label: "Luz" },
  { valor: "internet", label: "Internet" },
  { valor: "aluguel", label: "Aluguel" },
  { valor: "condominio", label: "Condomínio" },
  { valor: "taxas", label: "Taxas" },
  { valor: "impostos", label: "Impostos" },
  { valor: "outros", label: "Outros" },
];

export function labelCategoria(categoria: CategoriaConta): string {
  return CATEGORIAS_CONTA.find((c) => c.valor === categoria)?.label ?? categoria;
}

export type StatusConta = "pendente" | "pago";

export interface ContaPagar {
  id: string;
  categoria: CategoriaConta;
  descricao: string | null;
  valor: number;
  vencimento: string | null;
  status: StatusConta;
  pago_em: string | null;
  criado_em: string;
}

export interface Bonificacao {
  id: string;
  corretor_id: string;
  oportunidade_id: string | null;
  descricao: string;
  valor: number;
  data_pagamento: string;
  criado_em: string;
  // Anexado via join
  corretor?: { nome: string } | null;
}
