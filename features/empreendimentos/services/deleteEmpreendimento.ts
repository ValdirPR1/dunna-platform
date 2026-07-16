import { supabase } from "@/lib/supabase";

export async function deleteEmpreendimento(id: string) {

  return await supabase
    .from("empreendimentos")
    .delete()
    .eq("id", id);

}