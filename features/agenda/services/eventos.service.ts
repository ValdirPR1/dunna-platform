import { supabase } from "@/lib/supabase";
import { Evento, EventoParticipante, StatusParticipacao } from "../types/evento";
import { notificarCorretorSobreEvento } from "@/features/notificacoes/services/emailNotificacao.service";
import { notificarCorretorSobreEventoPush } from "@/features/notificacoes/services/pushNotificacao.service";

// Se corretorId for passado, devolve só os eventos em que esse
// corretor participa (a RLS já garante isso pro próprio corretor
// logado; passar o id explicitamente também serve pro master filtrar
// "ver agenda de: fulano" no dropdown da Agenda).
export async function listarEventos(corretorId?: string): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*, evento_participantes(*, corretores(nome))")
    .order("data_hora", { ascending: true });

  if (error || !data) return [];

  const eventos: Evento[] = (data as any[]).map((e) => {
    const participantes: EventoParticipante[] = (e.evento_participantes ?? []).map(
      (p: any) => ({
        id: p.id,
        evento_id: p.evento_id,
        corretor_id: p.corretor_id,
        status: p.status,
        respondido_em: p.respondido_em,
        compareceu: p.compareceu ?? null,
        corretor: p.corretores ? { nome: p.corretores.nome } : null,
      })
    );

    return {
      id: e.id,
      titulo: e.titulo,
      descricao: e.descricao,
      data_hora: e.data_hora,
      local: e.local,
      criado_por: e.criado_por,
      created_at: e.created_at,
      participantes,
      minhaParticipacao: corretorId
        ? participantes.find((p) => p.corretor_id === corretorId) ?? null
        : null,
    };
  });

  if (!corretorId) return eventos;

  return eventos.filter((e) =>
    e.participantes.some((p) => p.corretor_id === corretorId)
  );
}

export interface NovoEventoInput {
  titulo: string;
  descricao: string;
  data_hora: string;
  local: string;
  corretorIds: string[];
}

export async function criarEvento(form: NovoEventoInput, criadoPor: string) {
  const { data: evento, error } = await supabase
    .from("eventos")
    .insert({
      titulo: form.titulo,
      descricao: form.descricao || null,
      data_hora: form.data_hora,
      local: form.local || null,
      criado_por: criadoPor,
    })
    .select("id")
    .single();

  if (error) throw error;

  if (form.corretorIds.length > 0) {
    const { error: erroParticipantes } = await supabase
      .from("evento_participantes")
      .insert(
        form.corretorIds.map((corretorId) => ({
          evento_id: evento.id,
          corretor_id: corretorId,
        }))
      );

    if (erroParticipantes) throw erroParticipantes;
  }

  // Avisa cada convidado (e-mail + push). Não trava a criação do
  // evento se alguma notificação falhar.
  for (const corretorId of form.corretorIds) {
    notificarCorretorSobreEvento(corretorId, {
      titulo: form.titulo,
      dataHora: form.data_hora,
    }).catch(() => {});
    notificarCorretorSobreEventoPush(corretorId, { titulo: form.titulo }).catch(
      () => {}
    );
  }

  return evento.id as string;
}

export async function excluirEvento(id: string) {
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw error;
}

// Chamado pelo master depois que o evento aconteceu, pra registrar
// quem realmente compareceu (diferente do RSVP que o corretor deu
// antes). É esse dado que entra no relatório de desempenho.
export async function marcarComparecimento(
  eventoParticipanteId: string,
  compareceu: boolean
) {
  const { error } = await supabase
    .from("evento_participantes")
    .update({ compareceu })
    .eq("id", eventoParticipanteId);

  if (error) throw error;
}

// Chamado pelo corretor pra confirmar ou recusar presença no evento
export async function responderParticipacao(
  eventoId: string,
  corretorId: string,
  status: StatusParticipacao
) {
  const { error } = await supabase
    .from("evento_participantes")
    .update({ status, respondido_em: new Date().toISOString() })
    .eq("evento_id", eventoId)
    .eq("corretor_id", corretorId);

  if (error) throw error;
}
