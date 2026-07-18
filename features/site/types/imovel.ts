export interface ImovelSite {
  id: string;
  empreendimento_id: string | null;
  titulo: string;
  slug: string;
  tipo: string | null;
  status: string | null;
  codigo: string | null;
  cidade: string;
  bairro: string | null;
  endereco: string | null;
  cep: string | null;
  descricao: string | null;
  preco: number;
  quartos: number | null;
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  area_privativa: number | null;
  area_total: number | null;
  condominio: number | null;
  iptu: number | null;
  destaque: boolean | null;
  publicado: boolean;
  ativo: boolean | null;
  selo: string | null;
  detalhes: string[] | null;
  corretor_id: string | null;
  created_at: string;
  // Não vem direto do banco: montado a partir de uma tabela de fotos,
  // quando existir. Até lá, fica null e o card usa uma imagem padrão.
  foto_capa?: string | null;
  // Algumas fotos do imóvel, pro carrossel do card na listagem
  fotos?: string[];
}

export interface CorretorSite {
  id: string;
  nome: string;
  telefone: string | null;
  creci: string | null;
  foto: string | null;
}

export interface ImovelImagem {
  id: string;
  imovel_id: string;
  url: string;
  ordem: number;
}
