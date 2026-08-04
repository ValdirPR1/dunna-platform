import { supabase } from "@/lib/supabase";
import { Meta, MetaRealizacao, TipoMetrica, definicaoDaMetrica } from "../types/meta";
import { obterPeriodoAtual } from "../utils/periodo";

// Alvos (metas) — definidos só pelo master

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

// Realizações — lançadas pelo corretor (ou corrigidas pelo master)

export async function listarRealizacoesAtuais(
  corretorId?: string
): Promise<MetaRealizacao[]> {
  let query = supabase.from("metas_realizacoes").select("*");
  if (corretorId) query = query.eq("corretor_id", corretorId);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as MetaRealizacao[];
}

export async function listarHistorico(
  corretorId: string
): Promise<MetaRealizacao[]> {
  const hoje = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("metas_realizacoes")
    .select("*")
    .eq("corretor_id", corretorId)
    .lt("periodo_fim", hoje)
    .order("periodo_inicio", { ascending: false });

  if (error || !data) return [];
  return data as MetaRealizacao[];
}

// Cria (se ainda não existir) ou atualiza o lançamento do período
// atual pra essa métrica. Na criação, "congela" o alvo vigente nesse
// momento em valor_alvo — assim, se o master mudar a meta depois, o
// histórico desse período continua mostrando o alvo que valia então.
export async function salvarRealizado(
  corretorId: string,
  tipoMetrica: TipoMetrica,
  valorRealizado: number
) {
  const def = definicaoDaMetrica(tipoMetrica);
  const periodo = obterPeriodoAtual(def.periodicidade);

  const { data: existente } = await supabase
    .from("metas_realizacoes")
    .select("id")
    .eq("corretor_id", corretorId)
    .eq("tipo_metrica", tipoMetrica)
    .eq("periodo_inicio", periodo.inicio)
    .maybeSingle();

  if (existente) {
    const { error } = await supabase
      .from("metas_realizacoes")
      .update({ valor_realizado: valorRealizado, atualizado_em: new Date().toISOString() })
      .eq("id", existente.id);

    if (error) throw error;
    return;
  }

  const { data: meta } = await supabase
    .from("metas")
    .select("valor_alvo")
    .eq("corretor_id", corretorId)
    .eq("tipo_metrica", tipoMetrica)
    .maybeSingle();

  const { error } = await supabase.from("metas_realizacoes").insert({
    corretor_id: corretorId,
    tipo_metrica: tipoMetrica,
    periodo_inicio: periodo.inicio,
    periodo_fim: periodo.fim,
    valor_alvo: meta?.valor_alvo ?? 0,
    valor_realizado: valorRealizado,
  });

  if (error) throw error;
}
