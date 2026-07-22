export type UnidadeStatus = "Disponível" | "Reservada" | "Vendida";

export interface Unidade {
  id: string;
  empreendimento_id: string;
  torre: string | null;
  bloco: string | null;
  andar: number | null;
  numero: string;
  tipologia: string | null;
  quartos: number | null;
  suites: number | null;
  vagas: number | null;
  area: number | null;
  preco: number | null;
  comissao: number | null;
  status: UnidadeStatus;
  cliente_id: string | null;
  corretor_id: string | null;
  imovel_id: string | null;
  created_at?: string;
}

export interface UnidadeFoto {
  id: string;
  unidade_id: string;
  url: string;
  ordem: number;
  capa: boolean;
}

export interface Corretor {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  creci: string | null;
  ativo: boolean | null;
}

export interface EmpreendimentoResumo {
  id: string;
  nome: string;
  cidade: string | null;
  bairro: string | null;
  latitude: number | null;
  longitude: number | null;
}
