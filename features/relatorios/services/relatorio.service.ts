import { supabase } from "@/lib/supabase";
import { ETAPAS, Etapa } from "@/features/crm/types/oportunidade";
import {
  listarMetas,
  obterProgressoMensal,
} from "@/features/metas/services/metas.service";
import { METRICAS, TipoMetrica } from "@/features/metas/types/meta";
import { obterPeriodoAtual } from "@/features/metas/utils/periodo";

export interface LinhaFunil {
  etapa: Etapa;
  quantidade: number;
}

export interface LinhaMetrica {
  tipo: TipoMetrica;
  label: string;
  labelPeriodo: string;
  alvo: number;
  realizado: number;
}

export interface EventoParticipado {
  titulo: string;
  data: string;
}

export interface DadosRelatorio {
  corretorNome: string;
  periodoRotulo: string;
  periodoInicio: string;
  periodoFim: string;
  leadsRecebidos: number;
  funil: LinhaFunil[];
  totalAtivos: number;
  metricas: LinhaMetrica[];
  eventosParticipados: EventoParticipado[];
}

// Junta tudo que entra no relatório mensal de um corretor: leads que
// chegaram pra ele, onde estão hoje no funil, o que ele se
// comprometeu a fazer x o que fez (vindo da aba Metas) e quantos
// compromissos de equipe/treinamentos ele de fato compareceu.
export async function obterDadosRelatorio(
  corretorId: string,
  corretorNome: string
): Promise<DadosRelatorio> {
  const periodo = obterPeriodoAtual("mensal");

  const [metas, progresso, oportunidadesResp, participacoesResp] = await Promise.all([
    listarMetas(corretorId),
    obterProgressoMensal(corretorId, periodo.inicio, periodo.fim),
    supabase
      .from("oportunidades")
      .select("etapa, perdido, created_at")
      .eq("corretor_id", corretorId),
    supabase
      .from("evento_participantes")
      .select("compareceu, eventos(titulo, data_hora)")
      .eq("corretor_id", corretorId)
      .eq("compareceu", true),
  ]);

  const oportunidades = (oportunidadesResp.data ?? []) as {
    etapa: Etapa;
    perdido: boolean | null;
    created_at: string;
  }[];

  const leadsRecebidos = oportunidades.filter((o) => {
    const data = o.created_at?.slice(0, 10);
    return data && data >= periodo.inicio && data <= periodo.fim;
  }).length;

  const ativas = oportunidades.filter((o) => !o.perdido);

  const funil: LinhaFunil[] = ETAPAS.map((etapa) => ({
    etapa,
    quantidade: ativas.filter((o) => o.etapa === etapa).length,
  }));

  const metaPorTipo = new Map(metas.map((m) => [m.tipo_metrica, m.valor_alvo]));

  const metricas: LinhaMetrica[] = METRICAS.map((m) => ({
    tipo: m.tipo,
    label: m.label,
    labelPeriodo: m.labelPeriodo,
    alvo: metaPorTipo.get(m.tipo) ?? 0,
    realizado: progresso[m.tipo] ?? 0,
  }));

  const participacoesBrutas = (participacoesResp.data ?? []) as any[];

  const eventosParticipados: EventoParticipado[] = participacoesBrutas
    .map((p) => ({
      titulo: p.eventos?.titulo ?? "Evento",
      data: p.eventos?.data_hora ?? "",
    }))
    .filter((e) => {
      const data = e.data?.slice(0, 10);
      return data && data >= periodo.inicio && data <= periodo.fim;
    });

  return {
    corretorNome,
    periodoRotulo: periodo.rotulo,
    periodoInicio: periodo.inicio,
    periodoFim: periodo.fim,
    leadsRecebidos,
    funil,
    totalAtivos: ativas.length,
    metricas,
    eventosParticipados,
  };
}
