import { supabase } from "@/lib/supabase";

export interface NegocioFechado {
  id: string;
  titulo: string;
  valor: number;
  fechadoEm: string;
  pessoaNome: string;
  corretorNome: string | null;
}

// Só "Pós-venda" conta como negócio fechado de verdade — o lead só
// chega lá confirmando o contrato assinado no CRM (ver
// confirmarContratoAssinado em features/crm), então não tem mais
// como um card "quase fechado" em Contrato inflar o VGV.
export async function listarNegociosFechados(): Promise<NegocioFechado[]> {
  const { data, error } = await supabase
    .from("oportunidades")
    .select(
      "id, titulo, valor_venda, valor_previsto, valor_interesse, venda_fechada_em, created_at, pessoa_id, corretor_id, pessoas(nome), corretores(nome)"
    )
    .eq("etapa", "Pós-venda")
    .order("venda_fechada_em", { ascending: false });

  if (error || !data) return [];

  return (data as any[]).map((item) => ({
    id: item.id,
    titulo: item.titulo,
    // valor_venda é o valor confirmado no fechamento; cai pros
    // campos antigos só em registros legados sem esse dado
    valor: Number(item.valor_venda ?? item.valor_previsto ?? item.valor_interesse ?? 0),
    fechadoEm: item.venda_fechada_em ?? item.created_at,
    pessoaNome: item.pessoas?.nome ?? "—",
    corretorNome: item.corretores?.nome ?? null,
  }));
}

export function calcularVendasPorMes(negocios: NegocioFechado[]) {
  const mapa = new Map<string, number>();

  for (const negocio of negocios) {
    const data = new Date(negocio.fechadoEm);
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
