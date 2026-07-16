import { supabase } from "@/lib/supabase";

export async function listarImoveis() {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function buscarImovel(id: string) {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function criarImovel(payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("imoveis")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarImovel(
  id: string,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("imoveis")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}