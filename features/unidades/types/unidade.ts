export type UnidadeStatus =
  | "Disponível"
  | "Reservada"
  | "Vendida";

export interface Unidade {

  id: string;

  empreendimento_id: string;

  numero: string;

  bloco: string;

  torre: string;

  andar: number;

  tipologia: string;

  quartos: number;

  suites: number;

  banheiros: number;

  vagas: number;

  area_privativa: number;

  area_total: number;

  preco_tabela: number;

  preco_promocional: number;

  comissao: number;

  posicao_solar: string;

  vista: string;

  observacoes: string;

  status: UnidadeStatus;

  created_at?: string;

}