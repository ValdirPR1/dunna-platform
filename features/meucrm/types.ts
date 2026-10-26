export const ETAPAS = [
  "Novo",
  "Contato feito",
  "Conversando",
  "Proposta",
  "Fechado",
  "Perdido",
] as const;

export type Etapa = (typeof ETAPAS)[number];

export const ORIGENS = [
  "YouTube",
  "Instagram",
  "TikTok",
  "Facebook",
  "WhatsApp",
  "Indicação",
  "Outro",
] as const;

export const COR_ETAPA: Record<string, string> = {
  Novo: "#64748b",
  "Contato feito": "#0ea5e9",
  Conversando: "#b8975a",
  Proposta: "#8b5cf6",
  Fechado: "#16a34a",
  Perdido: "#dc2626",
};

export interface ClienteCrm {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  origem: string;
  etapa: string;
  interesse: string | null;
  valor_estimado: number | null;
  observacoes: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface TarefaCrm {
  id: string;
  cliente_id: string | null;
  titulo: string;
  descricao: string | null;
  data_hora: string;
  concluida: boolean;
  concluida_em: string | null;
  criado_em: string;
}

export interface NotaCrm {
  id: string;
  cliente_id: string;
  texto: string;
  criado_em: string;
}
