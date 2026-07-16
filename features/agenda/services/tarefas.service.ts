import { supabase } from "@/lib/supabase";
import { Tarefa } from "../types/tarefa";

export async function listarTarefas(
  corretorId?: string
): Promise<Tarefa[]> {
  let query = supabase
    .from("tarefas")
    .select("*")
    .order("data_hora", { ascending: true });

  if (corretorId) {
    query = query.eq("corretor_id", corretorId);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  // Busca o título das oportunidades vinculadas, numa segunda consulta
  const oportunidadeIds = [
    ...new Set(
      data.map((t: any) => t.oportunidade_id).filter(Boolean)
    ),
  ];

  if (oportunidadeIds.length === 0) {
    return data as Tarefa[];
  }

  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("id, titulo, pessoa_id, pessoas(nome)")
    .in("id", oportunidadeIds);

  const mapaOportunidades = new Map(
    (oportunidades ?? []).map((o: any) => [
      o.id,
      { titulo: o.titulo, pessoa_nome: o.pessoas?.nome },
    ])
  );

  return (data as any[]).map((t) => ({
    ...t,
    oportunidade: t.oportunidade_id
      ? mapaOportunidades.get(t.oportunidade_id) ?? null
      : null,
  }));
}

export interface NovaTarefaInput {
  corretor_id: string;
  oportunidade_id: string;
  tipo: string;
  titulo: string;
  data_hora: string;
  observacoes: string;
}

export async function criarTarefa(form: NovaTarefaInput) {
  const { error } = await supabase.from("tarefas").insert({
    corretor_id: form.corretor_id || null,
    oportunidade_id: form.oportunidade_id || null,
    tipo: form.tipo,
    titulo: form.titulo,
    data_hora: form.data_hora,
    observacoes: form.observacoes || null,
  });

  if (error) throw error;
}

export async function atualizarTarefa(
  id: string,
  form: Partial<NovaTarefaInput>
) {
  const payload: Record<string, unknown> = { ...form };
  if ("corretor_id" in payload) payload.corretor_id = form.corretor_id || null;
  if ("oportunidade_id" in payload)
    payload.oportunidade_id = form.oportunidade_id || null;

  const { error } = await supabase
    .from("tarefas")
    .update(payload)
    .eq("id", id);

  if (error) throw error;
}

export async function marcarConcluida(id: string, concluida: boolean) {
  const { error } = await supabase
    .from("tarefas")
    .update({ concluida })
    .eq("id", id);

  if (error) throw error;
}

export async function excluirTarefa(id: string) {
  const { error } = await supabase.from("tarefas").delete().eq("id", id);
  if (error) throw error;
}
