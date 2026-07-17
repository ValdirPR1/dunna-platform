import { supabase } from "@/lib/supabase";

export interface ImovelVisualizado {
  imovelId: string;
  titulo: string;
  totalVisualizacoes: number;
}

export async function listarImoveisMaisVisualizados(
  limite = 6
): Promise<ImovelVisualizado[]> {
  const { data: visualizacoes, error } = await supabase
    .from("visualizacoes_imoveis")
    .select("imovel_id");

  if (error || !visualizacoes || visualizacoes.length === 0) return [];

  const contagem = new Map<string, number>();

  for (const item of visualizacoes as any[]) {
    contagem.set(item.imovel_id, (contagem.get(item.imovel_id) ?? 0) + 1);
  }

  const idsOrdenados = Array.from(contagem.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite);

  const ids = idsOrdenados.map(([id]) => id);

  const { data: imoveis } = await supabase
    .from("imoveis")
    .select("id, titulo")
    .in("id", ids);

  const mapaTitulos = new Map(
    (imoveis ?? []).map((i: any) => [i.id, i.titulo])
  );

  return idsOrdenados.map(([imovelId, total]) => ({
    imovelId,
    titulo: mapaTitulos.get(imovelId) ?? "Imóvel removido",
    totalVisualizacoes: total,
  }));
}
