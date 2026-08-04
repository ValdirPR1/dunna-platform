export type StatusParticipacao = "pendente" | "confirmado" | "recusado";

export interface EventoParticipante {
  id: string;
  evento_id: string;
  corretor_id: string;
  status: StatusParticipacao;
  respondido_em: string | null;
  // Presença real, marcada pelo master depois que o evento acontece
  // (diferente de "status", que é só o RSVP do corretor antes do
  // evento). null = ainda não marcada.
  compareceu: boolean | null;
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
