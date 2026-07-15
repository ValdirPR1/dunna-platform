export interface Empreendimento {
  id: string;

  nome: string;

  slug?: string;

  cidade: string;

  bairro: string;

  estado?: string;

  endereco?: string;

  cep?: string;

  latitude?: string;

  longitude?: string;

  construtora: string;

  incorporadora?: string;

  tipo?: string;

  status:
    | "Lançamento"
    | "Em Obras"
    | "Pronto";

  entrega?: string;

  registro?: string;

  valorInicial: number;

  valorFinal: number;

  areaMin?: number;

  areaMax?: number;

  vgv: number;

  descricao?: string;

  diferenciais?: string;

  infraestrutura?: string;

  lazer?: string;

  publico?: string;

  capa?: string;

  ativo?: boolean;

  destaque?: boolean;

  publicadoSite?: boolean;

  created_at?: string;

  publicado: boolean;

  destaque: boolean;

}