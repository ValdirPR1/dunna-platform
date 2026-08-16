import { supabase } from "@/lib/supabase";

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
        .select("id, nome, created_at")
        .order("created_at", { ascending: false })
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
      data: item.created_at,
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
