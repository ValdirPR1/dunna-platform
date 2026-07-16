import { supabase } from "@/lib/supabase";

export async function createEmpreendimento(payload: any) {

  return await supabase
    .from("empreendimentos")
    .insert(payload)
    .select()
    .single();

}