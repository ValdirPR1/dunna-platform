export const TIPOS_TAREFA = [
  "Ligação",
  "WhatsApp",
  "Visita",
  "Reunião",
  "Outro",
] as const;

export type TipoTarefa = (typeof TIPOS_TAREFA)[number];

export interface Tarefa {
  id: string;
  corretor_id: string | null;
  oportunidade_id: string | null;
  tipo: TipoTarefa;
  titulo: string;
  data_hora: string;
  concluida: boolean;
  observacoes: string | null;
  created_at: string;
  // Anexado depois, não vem direto do banco
  oportunidade?: { titulo: string; pessoa_nome?: string } | null;
}
