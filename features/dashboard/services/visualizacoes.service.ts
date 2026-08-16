import { supabase } from "@/lib/supabase";

export type PeriodoVisualizacoes = "7d" | "30d" | "total";

export interface VisualizacaoPorDia {
  data: string; // rótulo pra mostrar no gráfico, ex.: "15/08"
  total: number;
}

// Chave de agrupamento por dia, usando o fuso horário local de quem
// está vendo o dashboard (getFullYear/getMonth/getDate são sempre no
// horário local do navegador, não em UTC) — assim uma visualização às
// 23h não "vaza" pro dia seguinte por causa do UTC.
function chaveDia(dataISO: string) {
  const d = new Date(dataISO);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function rotuloDia(chave: string) {
  const [, mes, dia] = chave.split("-");
  return `${dia}/${mes}`;
}

// Total de visualizações de imóveis por dia, no período escolhido —
// alimenta o gráfico de linha do dashboard. Em "7d"/"30d" preenche
// todos os dias do período (mesmo os sem visualização, como 0) pra a
// linha não pular datas; em "total" mostra só os dias que realmente
// tiveram alguma visualização, desde o começo do histórico.
export async function listarVisualizacoesPorDia(
  periodo: PeriodoVisualizacoes = "30d"
): Promise<VisualizacaoPorDia[]> {
  let query = supabase
    .from("visualizacoes_imoveis")
    .select("created_at")
    .order("created_at", { ascending: true });

  let desde: Date | null = null;

  if (periodo !== "total") {
    const dias = periodo === "7d" ? 7 : 30;
    desde = new Date();
    desde.setHours(0, 0, 0, 0);
    desde.setDate(desde.getDate() - (dias - 1));
    query = query.gte("created_at", desde.toISOString());
  }

  const { data, error } = await query;
  if (error) return [];

  const contagem = new Map<string, number>();
  for (const item of (data ?? []) as any[]) {
    const chave = chaveDia(item.created_at);
    contagem.set(chave, (contagem.get(chave) ?? 0) + 1);
  }

  if (!desde) {
    return Array.from(contagem.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([chave, total]) => ({ data: rotuloDia(chave), total }));
  }

  const resultado: VisualizacaoPorDia[] = [];
  const cursor = new Date(desde);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  while (cursor <= hoje) {
    const chave = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    resultado.push({ data: rotuloDia(chave), total: contagem.get(chave) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return resultado;
}
