import { supabase } from "@/lib/supabase";

export type CategoriaInsight =
  | "captacao"
  | "preco"
  | "cliente"
  | "gestao";

export interface Insight {
  id: string;
  categoria: CategoriaInsight;
  titulo: string;
  mensagem: string;
  prioridade: "alta" | "media" | "baixa";
}

export const LABEL_CATEGORIA: Record<CategoriaInsight, string> = {
  captacao: "Captação",
  preco: "Preço",
  cliente: "Cliente",
  gestao: "Gestão",
};

const ETAPAS_FECHADAS = ["Contrato", "Pós-venda"];

export async function gerarInsights(): Promise<Insight[]> {
  const insights: Insight[] = [];

  await Promise.all([
    insightsCaptacao(insights),
    insightsPreco(insights),
    insightsCliente(insights),
    insightsGestao(insights),
  ]);

  const ordemPrioridade = { alta: 0, media: 1, baixa: 2 };

  return insights.sort(
    (a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]
  );
}

// ===== 1. Captação: empreendimentos com pouco estoque =====

async function insightsCaptacao(insights: Insight[]) {
  const [{ data: empreendimentos }, { data: unidades }] = await Promise.all([
    supabase.from("empreendimentos").select("id, nome").eq("ativo", true),
    supabase.from("unidades").select("empreendimento_id, status"),
  ]);

  if (!empreendimentos || !unidades) return;

  for (const emp of empreendimentos) {
    const doEmpreendimento = unidades.filter(
      (u: any) => u.empreendimento_id === emp.id
    );

    if (doEmpreendimento.length === 0) continue;

    const disponiveis = doEmpreendimento.filter(
      (u: any) => (u.status ?? "").toLowerCase() !== "vendida"
    );

    if (disponiveis.length > 0 && disponiveis.length <= 2) {
      insights.push({
        id: `captacao-${emp.id}`,
        categoria: "captacao",
        titulo: emp.nome,
        mensagem: `Este empreendimento possui apenas ${disponiveis.length} unidade${
          disponiveis.length > 1 ? "s" : ""
        } disponível${
          disponiveis.length > 1 ? "eis" : ""
        }. Vale entrar em contato com a construtora para atualizar o estoque.`,
        prioridade: "alta",
      });
    }
  }
}

// ===== 2. Preço: imóveis acima da média de preço/m² da própria cidade =====

async function insightsPreco(insights: Insight[]) {
  const { data: imoveis } = await supabase
    .from("imoveis")
    .select("id, titulo, cidade, preco, area_privativa")
    .eq("publicado", true);

  if (!imoveis) return;

  const comM2 = imoveis
    .filter((i: any) => i.preco && i.area_privativa && i.area_privativa > 0)
    .map((i: any) => ({ ...i, precoM2: i.preco / i.area_privativa }));

  const cidades = [...new Set(comM2.map((i: any) => i.cidade))];

  for (const cidade of cidades) {
    const doGrupo = comM2.filter((i: any) => i.cidade === cidade);
    if (doGrupo.length < 2) continue;

    const media =
      doGrupo.reduce((soma: number, i: any) => soma + i.precoM2, 0) /
      doGrupo.length;

    for (const item of doGrupo) {
      const diferenca = ((item.precoM2 - media) / media) * 100;

      if (diferenca >= 15) {
        insights.push({
          id: `preco-${item.id}`,
          categoria: "preco",
          titulo: item.titulo,
          mensagem: `Este imóvel está ${diferenca.toFixed(
            0
          )}% acima da média de preço por m² em ${cidade}. A chance de venda pode ser menor nesse patamar.`,
          prioridade: "media",
        });
      }
    }
  }
}

// ===== 3. Cliente: leads parados sem movimentação =====

async function insightsCliente(insights: Insight[]) {
  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("id, titulo, created_at, pessoas(nome)")
    .eq("etapa", "Novo Lead");

  if (!oportunidades) return;

  const agora = Date.now();

  for (const op of oportunidades as any[]) {
    const dias = Math.floor(
      (agora - new Date(op.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dias >= 3) {
      insights.push({
        id: `cliente-${op.id}`,
        categoria: "cliente",
        titulo: op.pessoas?.nome ?? op.titulo,
        mensagem: `Esse lead está há ${dias} dias parado na etapa "Novo Lead", sem avançar no funil. Vale priorizar o atendimento.`,
        prioridade: dias >= 7 ? "alta" : "media",
      });
    }
  }
}

// ===== 4. Gestão: taxa de conversão e carga por corretor =====

async function insightsGestao(insights: Insight[]) {
  const { data: oportunidades } = await supabase
    .from("oportunidades")
    .select("etapa, corretor_id, corretores(nome)");

  if (!oportunidades || oportunidades.length === 0) return;

  const fechadas = oportunidades.filter((o: any) =>
    ETAPAS_FECHADAS.includes(o.etapa)
  ).length;

  const taxa = (fechadas / oportunidades.length) * 100;

  insights.push({
    id: "gestao-conversao",
    categoria: "gestao",
    titulo: "Taxa de conversão geral",
    mensagem: `Hoje, ${taxa.toFixed(
      0
    )}% das oportunidades cadastradas já viraram negócio fechado (${fechadas} de ${oportunidades.length}).`,
    prioridade: "baixa",
  });

  const contagemPorCorretor: Record<string, { nome: string; total: number }> =
    {};

  for (const o of oportunidades as any[]) {
    if (!o.corretor_id || ETAPAS_FECHADAS.includes(o.etapa)) continue;

    if (!contagemPorCorretor[o.corretor_id]) {
      contagemPorCorretor[o.corretor_id] = {
        nome: o.corretores?.nome ?? "Sem nome",
        total: 0,
      };
    }

    contagemPorCorretor[o.corretor_id].total += 1;
  }

  const maisCarregado = Object.values(contagemPorCorretor).sort(
    (a, b) => b.total - a.total
  )[0];

  if (maisCarregado && maisCarregado.total >= 3) {
    insights.push({
      id: "gestao-carga",
      categoria: "gestao",
      titulo: maisCarregado.nome,
      mensagem: `Esse corretor está com ${maisCarregado.total} oportunidades em andamento — o maior volume da equipe no momento. Vale avaliar se precisa de apoio.`,
      prioridade: "baixa",
    });
  }
}
