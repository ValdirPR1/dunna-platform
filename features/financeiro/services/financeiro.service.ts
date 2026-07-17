import { supabase } from "@/lib/supabase";

export interface NegocioFechado {
  id: string;
  titulo: string;
  etapa: string;
  valor: number;
  comissao_percentual: number | null;
  comissao_paga: boolean;
  created_at: string;
  pessoaNome: string;
  corretorNome: string | null;
}

const ETAPAS_FECHADAS = ["Contrato", "Pós-venda"];

export async function listarNegociosFechados(): Promise<NegocioFechado[]> {
  const { data, error } = await supabase
    .from("oportunidades")
    .select(
      "id, titulo, etapa, valor_previsto, valor_interesse, comissao_percentual, comissao_paga, created_at, pessoa_id, corretor_id, pessoas(nome), corretores(nome)"
    )
    .in("etapa", ETAPAS_FECHADAS)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as any[]).map((item) => ({
    id: item.id,
    titulo: item.titulo,
    etapa: item.etapa,
    valor: Number(item.valor_previsto ?? item.valor_interesse ?? 0),
    comissao_percentual: item.comissao_percentual,
    comissao_paga: item.comissao_paga ?? false,
    created_at: item.created_at,
    pessoaNome: item.pessoas?.nome ?? "—",
    corretorNome: item.corretores?.nome ?? null,
  }));
}

export async function atualizarComissao(
  id: string,
  dados: { comissao_percentual?: number | null; comissao_paga?: boolean }
) {
  const { error } = await supabase
    .from("oportunidades")
    .update(dados)
    .eq("id", id);

  if (error) throw error;
}

export function calcularVendasPorMes(negocios: NegocioFechado[]) {
  const mapa = new Map<string, number>();

  for (const negocio of negocios) {
    const data = new Date(negocio.created_at);
    const chave = data.toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    });

    mapa.set(chave, (mapa.get(chave) ?? 0) + negocio.valor);
  }

  return Array.from(mapa.entries())
    .map(([mes, total]) => ({ mes, total }))
    .slice(-6);
}
