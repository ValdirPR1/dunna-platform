import { supabase } from "@/lib/supabase";
import { Empreendimento } from "@/types/empreendimento";

export async function listarEmpreendimentos() {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Empreendimento[];
}

export async function buscarEmpreendimento(id: string) {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Empreendimento;
}

export async function criarEmpreendimento(
  empreendimento: Omit<Empreendimento, "id">
) {
  const { data, error } = await supabase
    .from("empreendimentos")
    .insert(empreendimento)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarEmpreendimento(
  id: string,
  empreendimento: Partial<Empreendimento>
) {
  const { data, error } = await supabase
    .from("empreendimentos")
    .update(empreendimento)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function excluirEmpreendimento(id: string) {
  const { error } = await supabase
    .from("empreendimentos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}