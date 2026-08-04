export type FormaRecebimento = "avista" | "parcelado";
export type StatusComissao = "a_definir" | "definida";

export interface Comissao {
  id: string;
  oportunidade_id: string;
  corretor_id: string | null;
  valor_venda: number | null;
  percentual_imobiliaria: number | null;
  valor_comissao_imobiliaria: number | null;
  percentual_corretor: number | null;
  valor_comissao_corretor: number | null;
  forma_recebimento: FormaRecebimento | null;
  parcelas: number | null;
  observacoes: string | null;
  status: StatusComissao;
  criado_em: string;
  atualizado_em: string;
  // Anexado depois de buscar em oportunidades/pessoas/corretores
  oportunidade?: { titulo: string; pessoaNome?: string | null } | null;
  corretor?: { nome: string } | null;
}
