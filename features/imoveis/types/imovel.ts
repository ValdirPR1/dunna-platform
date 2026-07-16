export type StatusImovel =
  | "Disponível"
  | "Reservado"
  | "Em negociação"
  | "Vendido"
  | "Indisponível";

export type ObjetivoImovel =
  | "Venda"
  | "Aluguel"
  | "Temporada";

export type OrigemImovel =
  | "Construtora"
  | "Revenda"
  | "Captação"
  | "Exclusivo"
  | "Parceria";

export interface Imovel {

  id: string;

  empreendimento_id?: string | null;

  titulo: string;

  codigo: string;

  tipo: string;

  origem: OrigemImovel;

  objetivo: ObjetivoImovel;

  status: StatusImovel;

  quartos: number;

  suites: number;

  banheiros: number;

  vagas: number;

  area_privativa: number;

  area_total: number;

  preco: number;

  comissao: number;

  condominio: number;

  iptu: number;

  descricao?: string;

  created_at?: string;

  cidade?: string;

bairro?: string;

endereco?: string;

cep?: string;

latitude?: number;

longitude?: number;

vista?: string;

posicao_solar?: string;

mobiliado?: boolean;

aceita_financiamento?: boolean;

aceita_permuta?: boolean;

destaque?: boolean;

publicar_site?: boolean;

publicar_instagram?: boolean;

publicar_portais?: boolean;

youtube?: string;

tour_virtual?: string;

proprietario_id?: string;

corretor_id?: string;

}