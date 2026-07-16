import { supabase } from "@/lib/supabase";

export async function listarInventario() {

  const {data,error}=await supabase

  .from("imoveis")

  .select("*")

  .order("created_at",{

    ascending:false,

  });

  if(error) throw error;

  return data ?? [];

}