export type EmpreendimentoStatus =
  | "Lançamento"
  | "Em Obras"
  | "Pronto"
  | "Vendido";

export interface Empreendimento {
  id: string;

  nome: string;

  cidade: string;

  bairro: string;

  endereco?: string;

  construtora?: string;

  tipo?: string;

  status: EmpreendimentoStatus;

  descricao?: string;

  valorInicial?: number;

  valorFinal?: number;

  vgv?: number;

  created_at?: string;
}