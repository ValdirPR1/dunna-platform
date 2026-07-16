import { supabase } from "@/lib/supabase";

export interface Notificacao {
  id: string;
  texto: string;
  data: string;
  tipo: "lead" | "oportunidade" | "tarefa";
}

function tempoRelativo(data: string) {
  const diffMs = Date.now() - new Date(data).getTime();
  const minutos = Math.floor(diffMs / 60000);

  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas}h`;

  const dias = Math.floor(horas / 24);
  return `há ${dias}d`;
}

export async function listarNotificacoes(): Promise<Notificacao[]> {
  const [leadsResp, oportunidadesResp, tarefasResp] = await Promise.all([
    supabase
      .from("pessoa_papeis")
      .select("pessoa_id, created_at, pessoas(nome)")
      .eq("papel", "lead")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("oportunidades")
      .select("id, titulo, etapa, created_at")
      .order("created_at", { ascending: false })
      .limit(5),

    // Tarefas atrasadas ou pra hoje, ainda não concluídas
    supabase
      .from("tarefas")
      .select("id, titulo, data_hora, concluida")
      .eq("concluida", false)
      .lte("data_hora", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
      .order("data_hora", { ascending: true })
      .limit(5),
  ]);

  const notificacoesLeads: Notificacao[] = (leadsResp.data ?? []).map(
    (item: any) => ({
      id: `lead-${item.pessoa_id}`,
      texto: `Novo lead: ${item.pessoas?.nome ?? "sem nome"}`,
      data: item.created_at,
      tipo: "lead",
    })
  );

  const notificacoesOportunidades: Notificacao[] = (
    oportunidadesResp.data ?? []
  ).map((item: any) => ({
    id: `oportunidade-${item.id}`,
    texto: `${item.titulo || "Oportunidade"} — ${item.etapa}`,
    data: item.created_at,
    tipo: "oportunidade",
  }));

  const notificacoesTarefas: Notificacao[] = (tarefasResp.data ?? []).map(
    (item: any) => {
      const atrasada = new Date(item.data_hora) < new Date();
      return {
        id: `tarefa-${item.id}`,
        texto: atrasada
          ? `Tarefa atrasada: ${item.titulo}`
          : `Tarefa hoje: ${item.titulo}`,
        data: item.data_hora,
        tipo: "tarefa",
      };
    }
  );

  return [
    ...notificacoesTarefas,
    ...notificacoesLeads,
    ...notificacoesOportunidades,
  ]
    .filter((n) => n.data)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 8);
}

export { tempoRelativo };
