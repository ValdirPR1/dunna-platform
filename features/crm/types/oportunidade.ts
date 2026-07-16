export const ETAPAS = [
  "Novo Lead",
  "Qualificação",
  "Visita",
  "Proposta",
  "Reserva",
  "Contrato",
  "Pós-venda",
] as const;

export type Etapa = (typeof ETAPAS)[number];

export type Prioridade = "Baixa" | "Normal" | "Alta";

export interface Oportunidade {
  id: string;
  titulo: string;
  etapa: Etapa;
  prioridade: Prioridade;
  valor_interesse: number | null;
  valor_previsto: number | null;
  previsao_fechamento: string | null;
  observacoes: string | null;
  observatorios: string | null;
  pessoa_id: string;
  corretor_id: string | null;
  criado_em: string;
  // Anexado depois de buscar em "pessoas" (não vem direto do banco)
  pessoa?: {
    nome: string;
    telefone: string | null;
    whatsapp: string | null;
    email?: string | null;
  } | null;
}
