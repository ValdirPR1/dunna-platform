import { supabase } from "@/lib/supabase";
import { ETAPAS } from "@/features/crm/types/oportunidade";

export async function listarPipeline() {
  const { data, error } = await supabase
    .from("oportunidades")
    .select("etapa");

  if (error || !data) {
    return ETAPAS.map((etapa) => ({ nome: etapa, total: 0 }));
  }

  return ETAPAS.map((etapa) => ({
    nome: etapa,
    total: data.filter((o: any) => o.etapa === etapa).length,
  }));
}

export interface LeadRecente {
  id: string;
  nome: string;
  criadoEm: string;
}

export async function listarLeadsRecentes(
  limite = 4
): Promise<LeadRecente[]> {
  const { data, error } = await supabase
    .from("pessoa_papeis")
    .select("pessoa_id, created_at, pessoas(nome)")
    .eq("papel", "lead")
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error || !data) return [];

  return (data as any[]).map((item) => ({
    id: item.pessoa_id,
    nome: item.pessoas?.nome ?? "Sem nome",
    criadoEm: item.created_at,
  }));
}

export interface AtividadeRecente {
  id: string;
  texto: string;
  data: string;
}

export async function listarAtividadesRecentes(
  limite = 6
): Promise<AtividadeRecente[]> {
  const [imoveisResp, empreendimentosResp, oportunidadesResp] =
    await Promise.all([
      supabase
        .from("imoveis")
        .select("id, titulo, created_at")
        .order("created_at", { ascending: false })
        .limit(limite),

      supabase
        .from("empreendimentos")
        .select("id, nome, criando_em")
        .order("criando_em", { ascending: false })
        .limit(limite),

      supabase
        .from("oportunidades")
        .select("id, titulo, etapa, created_at")
        .order("created_at", { ascending: false })
        .limit(limite),
    ]);

  const atividades: AtividadeRecente[] = [

    ...(imoveisResp.data ?? []).map((item: any) => ({
      id: `imovel-${item.id}`,
      texto: `Novo imóvel cadastrado: ${item.titulo}`,
      data: item.created_at,
    })),

    ...(empreendimentosResp.data ?? []).map((item: any) => ({
      id: `empreendimento-${item.id}`,
      texto: `Empreendimento cadastrado: ${item.nome}`,
      data: item.criando_em,
    })),

    ...(oportunidadesResp.data ?? []).map((item: any) => ({
      id: `oportunidade-${item.id}`,
      texto: `${item.titulo || "Nova oportunidade"} — ${item.etapa}`,
      data: item.created_at,
    })),

  ];

  return atividades
    .filter((a) => a.data)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, limite);
}
