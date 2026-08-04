import { supabase } from "@/lib/supabase";
import { Meta, ProgressoPeriodo, TipoMetrica } from "../types/meta";
import {
  obterPeriodoAtual,
  obterPeriodosAnteriores,
  Periodo,
} from "../utils/periodo";

// Mapeia cada métrica pro "tipo" usado na tabela de tarefas do CRM —
// é assim que o sistema sabe qual tarefa concluída conta pra qual
// métrica.
const TIPO_TAREFA_POR_METRICA: Partial<Record<TipoMetrica, string>> = {
  ligacoes: "Ligação",
  visitas: "Visita",
  reunioes: "Reunião",
};

// ================= metas (alvos) — definidos só pelo master =================

export async function listarMetas(corretorId?: string): Promise<Meta[]> {
  let query = supabase.from("metas").select("*");
  if (corretorId) query = query.eq("corretor_id", corretorId);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as Meta[];
}

export async function upsertMeta(
  corretorId: string,
  tipoMetrica: TipoMetrica,
  valorAlvo: number,
  atualizadoPor: string
) {
  const { error } = await supabase.from("metas").upsert(
    {
      corretor_id: corretorId,
      tipo_metrica: tipoMetrica,
      valor_alvo: valorAlvo,
      atualizado_por: atualizadoPor,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "corretor_id,tipo_metrica" }
  );

  if (error) throw error;
}

// ================= realizado — calculado automaticamente a partir do CRM =================
//
// Ligações, visitas e reuniões vêm de tarefas concluídas que estão
// vinculadas a um lead (oportunidade_id preenchido) — assim só conta
// atividade de verdade com a base de leads, não tarefas soltas.
// Vendas vêm de oportunidades que chegaram em "Pós-venda" através do
// botão "Contrato Assinado" (venda_fechada_em só é preenchido por
// esse fluxo — ver confirmarContratoAssinado). Captações vêm da data
// em que a captação foi cadastrada.

async function buscarTarefasConcluidas(
  corretorIds: string[],
  inicio: string,
  fim: string
) {
  const tipos = Object.values(TIPO_TAREFA_POR_METRICA);

  const { data, error } = await supabase
    .from("tarefas")
    .select("corretor_id, tipo, data_hora")
    .in("corretor_id", corretorIds)
    .in("tipo", tipos)
    .eq("concluida", true)
    .not("oportunidade_id", "is", null)
    .gte("data_hora", `${inicio}T00:00:00`)
    .lte("data_hora", `${fim}T23:59:59`);

  if (error || !data) return [];
  return data as { corretor_id: string; tipo: string; data_hora: string }[];
}

async function buscarVendasFechadas(
  corretorIds: string[],
  inicio: string,
  fim: string
) {
  const { data, error } = await supabase
    .from("oportunidades")
    .select("corretor_id, venda_fechada_em")
    .in("corretor_id", corretorIds)
    .eq("etapa", "Pós-venda")
    .not("venda_fechada_em", "is", null)
    .gte("venda_fechada_em", `${inicio}T00:00:00`)
    .lte("venda_fechada_em", `${fim}T23:59:59`);

  if (error || !data) return [];
  return data as { corretor_id: string; venda_fechada_em: string }[];
}

async function buscarCaptacoesCriadas(
  corretorIds: string[],
  inicio: string,
  fim: string
) {
  const { data, error } = await supabase
    .from("captacoes")
    .select("corretor_id, created_at")
    .in("corretor_id", corretorIds)
    .gte("created_at", `${inicio}T00:00:00`)
    .lte("created_at", `${fim}T23:59:59`);

  if (error || !data) return [];
  return data as { corretor_id: string; created_at: string }[];
}

function contarPorCorretorETipo(
  linhas: { corretor_id: string; tipo: string }[],
  corretorId: string,
  tipo: string
) {
  return linhas.filter((l) => l.corretor_id === corretorId && l.tipo === tipo).length;
}

// Progresso do período ATUAL (semana em curso pra ligações/visitas/
// reuniões, mês em curso pra vendas/captações), pra um ou mais
// corretores de uma vez — usado tanto na visão do corretor quanto na
// visão geral do master.
export async function obterProgressoAtual(
  corretorIds: string[]
): Promise<Record<string, Record<TipoMetrica, number>>> {
  const resultado: Record<string, Record<TipoMetrica, number>> = {};
  corretorIds.forEach((id) => {
    resultado[id] = { ligacoes: 0, visitas: 0, reunioes: 0, vendas: 0, captacoes: 0 };
  });

  if (corretorIds.length === 0) return resultado;

  const periodoSemana = obterPeriodoAtual("semanal");
  const periodoMes = obterPeriodoAtual("mensal");

  const [tarefas, vendas, captacoes] = await Promise.all([
    buscarTarefasConcluidas(corretorIds, periodoSemana.inicio, periodoSemana.fim),
    buscarVendasFechadas(corretorIds, periodoMes.inicio, periodoMes.fim),
    buscarCaptacoesCriadas(corretorIds, periodoMes.inicio, periodoMes.fim),
  ]);

  corretorIds.forEach((id) => {
    resultado[id].ligacoes = contarPorCorretorETipo(tarefas, id, "Ligação");
    resultado[id].visitas = contarPorCorretorETipo(tarefas, id, "Visita");
    resultado[id].reunioes = contarPorCorretorETipo(tarefas, id, "Reunião");
    resultado[id].vendas = vendas.filter((v) => v.corretor_id === id).length;
    resultado[id].captacoes = captacoes.filter((c) => c.corretor_id === id).length;
  });

  return resultado;
}

// Progresso das 5 métricas de UM corretor num intervalo de datas
// arbitrário (usado pelo gerador de relatório mensal — diferente de
// "obterProgressoAtual", que sempre olha só o período em curso).
export async function obterProgressoMensal(
  corretorId: string,
  inicio: string,
  fim: string
): Promise<Record<TipoMetrica, number>> {
  const [tarefas, vendas, captacoes] = await Promise.all([
    buscarTarefasConcluidas([corretorId], inicio, fim),
    buscarVendasFechadas([corretorId], inicio, fim),
    buscarCaptacoesCriadas([corretorId], inicio, fim),
  ]);

  return {
    ligacoes: contarPorCorretorETipo(tarefas, corretorId, "Ligação"),
    visitas: contarPorCorretorETipo(tarefas, corretorId, "Visita"),
    reunioes: contarPorCorretorETipo(tarefas, corretorId, "Reunião"),
    vendas: vendas.filter((v) => v.corretor_id === corretorId).length,
    captacoes: captacoes.filter((c) => c.corretor_id === corretorId).length,
  };
}

// Histórico dos últimos períodos (6 semanas pra ligações/visitas/
// reuniões, 6 meses pra vendas/captações) de UM corretor, comparado
// com o alvo atual dele em cada métrica.
export async function obterHistorico(corretorId: string): Promise<ProgressoPeriodo[]> {
  const metas = await listarMetas(corretorId);
  const metaPorTipo = new Map(metas.map((m) => [m.tipo_metrica, m.valor_alvo]));

  const periodosSemana = obterPeriodosAnteriores("semanal", 6);
  const periodosMes = obterPeriodosAnteriores("mensal", 6);

  const [tarefas, vendas, captacoes] = await Promise.all([
    periodosSemana.length > 0
      ? buscarTarefasConcluidas(
          [corretorId],
          periodosSemana[periodosSemana.length - 1].inicio,
          periodosSemana[0].fim
        )
      : Promise.resolve([]),
    periodosMes.length > 0
      ? buscarVendasFechadas(
          [corretorId],
          periodosMes[periodosMes.length - 1].inicio,
          periodosMes[0].fim
        )
      : Promise.resolve([]),
    periodosMes.length > 0
      ? buscarCaptacoesCriadas(
          [corretorId],
          periodosMes[periodosMes.length - 1].inicio,
          periodosMes[0].fim
        )
      : Promise.resolve([]),
  ]);

  const linhas: ProgressoPeriodo[] = [];

  function contarNoPeriodo(
    lista: { data_hora?: string; venda_fechada_em?: string; created_at?: string; tipo?: string }[],
    periodo: Periodo,
    campoData: "data_hora" | "venda_fechada_em" | "created_at",
    tipo?: string
  ) {
    return lista.filter((item) => {
      const data = (item[campoData] as string)?.slice(0, 10);
      if (!data) return false;
      if (tipo && item.tipo !== tipo) return false;
      return data >= periodo.inicio && data <= periodo.fim;
    }).length;
  }

  (["ligacoes", "visitas", "reunioes"] as TipoMetrica[]).forEach((metrica) => {
    const tipoTarefa = TIPO_TAREFA_POR_METRICA[metrica]!;
    periodosSemana.forEach((periodo) => {
      linhas.push({
        tipo_metrica: metrica,
        periodo_inicio: periodo.inicio,
        periodo_fim: periodo.fim,
        valor_alvo: metaPorTipo.get(metrica) ?? 0,
        valor_realizado: contarNoPeriodo(tarefas, periodo, "data_hora", tipoTarefa),
      });
    });
  });

  periodosMes.forEach((periodo) => {
    linhas.push({
      tipo_metrica: "vendas",
      periodo_inicio: periodo.inicio,
      periodo_fim: periodo.fim,
      valor_alvo: metaPorTipo.get("vendas") ?? 0,
      valor_realizado: contarNoPeriodo(vendas, periodo, "venda_fechada_em"),
    });
  });

  periodosMes.forEach((periodo) => {
    linhas.push({
      tipo_metrica: "captacoes",
      periodo_inicio: periodo.inicio,
      periodo_fim: periodo.fim,
      valor_alvo: metaPorTipo.get("captacoes") ?? 0,
      valor_realizado: contarNoPeriodo(captacoes, periodo, "created_at"),
    });
  });

  return linhas.sort((a, b) => (a.periodo_inicio < b.periodo_inicio ? 1 : -1));
}
