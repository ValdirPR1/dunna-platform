export interface EmpreendimentoSite {
  id: string;
  nome: string;
  slug: string;
  cidade: string;
  bairro: string | null;
  estado: string | null;
  endereco: string | null;
  cep: string | null;
  tipo: string | null;
  status: string | null;
  descricao: string | null;
  valor_inicial: number | null;
  valor_final: number | null;
  vgv: number | null;
  construtora: string | null;
  incorporadora: string | null;
  area_final: number | null;
  entrega: string | null;
  publicado: boolean;
  destaque: boolean | null;
  ativo: boolean | null;
  created_at: string;
  comodidades: string[] | null;
  localizacao_texto: string | null;
  valorizacao_texto: string | null;
  // Não vem direto do banco: montado a partir de empreendimento_imagens
  fotoCapa?: string | null;
  fotos?: string[];
}

export interface PlantaSite {
  id: string;
  tipologia: string;
  area: number | null;
  preco_a_partir: number | null;
  imagem_url: string;
  fotos: string[];
}
