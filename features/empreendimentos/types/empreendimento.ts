export type EmpreendimentoStatus =
  | "Em lançamento"
  | "Em obras"
  | "Pronto"
  | "Encerrado";

export interface Empreendimento {
  id: string;

  nome: string;

  slug: string;

  construtora: string;

  incorporadora: string;

  descricao: string;

  cidade: string;

  bairro: string;

  endereco: string;

  latitude: number | null;

  longitude: number | null;

  status: EmpreendimentoStatus;

  entregaPrevista: string | null;

  fotoCapa: string | null;

  totalUnidades: number;

  totalDisponiveis: number;

  publicado: boolean;

  createdAt: string;

  updatedAt: string;
}