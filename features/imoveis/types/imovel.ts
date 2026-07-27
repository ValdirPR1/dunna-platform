export interface Imovel {
  id: string;
  empreendimento_id: string | null;
  id_proprietario: string | null;
  captador_id: string | null;
  titulo: string;
  tipo: string | null;
  origem: string | null;
  objetivo: string | null;
  status: string | null;
  codigo: string | null;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  area_privativa: number | null;
  area_total: number | null;
  preco: number | null;
  comissao: number | null;
  condominio: number | null;
  iptu: number | null;
  iptu_periodicidade: string | null;
  destaque: boolean | null;
  publicado: boolean | null;
  ativo: boolean | null;
  descricao: string | null;
  created_at: string;
  cidade: string | null;
  bairro: string | null;
  endereco: string | null;
  cep: string | null;
  latitude: number | null;
  longitude: number | null;
  vista: string | null;
  posicao_solar: string | null;
  mobiliado: boolean | null;
  aceita_financiamento: boolean | null;
  aceita_permuta: boolean | null;
  publicar_site: boolean | null;
  publicar_instagram: boolean | null;
  publicar_portais: boolean | null;
  youtube: string | null;
  tour_virtual: string | null;
  corretor_id: string | null;
  selo: string | null;
  detalhes: string[] | null;
  slug: string | null;
}

export interface ImovelFoto {
  id: string;
  imovel_id: string;
  url: string;
  ordem: number;
  capa: boolean;
}
