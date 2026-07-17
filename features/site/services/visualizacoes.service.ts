import { supabase } from "@/lib/supabase";

export async function registrarVisualizacao(imovelId: string) {
  try {
    await supabase.from("visualizacoes_imoveis").insert({
      imovel_id: imovelId,
    });
  } catch (error) {
    // Não deixa o erro de tracking quebrar a página do imóvel
    console.error("Erro ao registrar visualização:", error);
  }
}
