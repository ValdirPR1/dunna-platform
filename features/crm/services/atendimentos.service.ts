import { supabase } from "@/lib/supabase";

export interface AtendimentoLead {
  id: string;
  oportunidade_id: string;
  autor: string | null;
  texto: string;
  created_at: string;
}

export async function listarAtendimentos(
  oportunidadeId: string
): Promise<AtendimentoLead[]> {
  const { data, error } = await supabase
    .from("atendimentos_lead")
    .select("*")
    .eq("oportunidade_id", oportunidadeId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as AtendimentoLead[];
}

export async function criarAtendimento(
  oportunidadeId: string,
  texto: string,
  autor?: string
) {
  const { error: erroAtendimento } = await supabase
    .from("atendimentos_lead")
    .insert({
      oportunidade_id: oportunidadeId,
      texto,
      autor: autor ?? null,
    });

  if (erroAtendimento) throw erroAtendimento;

  // Registrar um atendimento também conta como "movimentação" do lead
  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .update({ atualizado_em: new Date().toISOString() })
    .eq("id", oportunidadeId);

  if (erroOportunidade) throw erroOportunidade;
}

export async function excluirAtendimento(id: string) {
  const { error } = await supabase
    .from("atendimentos_lead")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
