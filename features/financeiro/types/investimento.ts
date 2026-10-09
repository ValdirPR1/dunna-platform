export interface Investimento {
  id: string;
  nome: string;
  instituicao: string | null;
  valor_atual: number;
  ativo: boolean;
  criado_em: string;
}

export type TipoMovimentoInvestimento = "aplicacao" | "resgate";

export interface MovimentoInvestimento {
  id: string;
  investimento_id: string;
  tipo: TipoMovimentoInvestimento;
  valor: number;
  data: string;
  descricao: string | null;
  criado_em: string;
}
