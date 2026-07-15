import { supabase } from "@/lib/supabase";

export async function listarEmpreendimentos() {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("id,nome")
    .order("nome");

  if (error) throw error;

  return data;
}