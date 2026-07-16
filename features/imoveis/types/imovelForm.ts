import {
  ObjetivoImovel,
  OrigemImovel,
  StatusImovel,
} from "./imovel";

export interface ImovelFormData {

  empreendimentoId: string;

  titulo: string;

  codigo: string;

  tipo: string;

  origem: OrigemImovel;

  objetivo: ObjetivoImovel;

  status: StatusImovel;

  quartos: string;

  suites: string;

  banheiros: string;

  vagas: string;

  areaPrivativa: string;

  areaTotal: string;

  preco: string;

  comissao: string;

  condominio: string;

  iptu: string;

  descricao: string;

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