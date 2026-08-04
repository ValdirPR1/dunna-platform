export type StatusParticipacao = "pendente" | "confirmado" | "recusado";

export interface EventoParticipante {
  id: string;
  evento_id: string;
  corretor_id: string;
  status: StatusParticipacao;
  respondido_em: string | null;
  // Anexado via join, não vem direto do banco
  corretor?: { nome: string } | null;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  data_hora: string;
  local: string | null;
  criado_por: string | null;
  created_at: string;
  participantes: EventoParticipante[];
  // Participação do corretor logado nesse evento (quando aplicável)
  minhaParticipacao?: EventoParticipante | null;
}
