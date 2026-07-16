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
  criando_em: string;
  // Não vem direto do banco: montado a partir de empreendimento_imagens
  fotoCapa?: string | null;
}
