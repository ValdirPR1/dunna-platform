import { supabase } from "@/lib/supabase";

export interface ConexaoGoogle {
  conectado: boolean;
  googleEmail?: string;
}

export async function verificarConexaoGoogle(
  corretorId: string
): Promise<ConexaoGoogle> {
  const { data } = await supabase
    .from("google_agenda_conexoes")
    .select("google_email")
    .eq("corretor_id", corretorId)
    .maybeSingle();

  if (!data) return { conectado: false };

  return { conectado: true, googleEmail: data.google_email };
}

export function urlConectarGoogleAgenda(corretorId: string) {
  return `/api/google-agenda/conectar?corretor_id=${corretorId}`;
}

export async function desconectarGoogleAgenda(corretorId: string) {
  await fetch("/api/google-agenda/desconectar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ corretorId }),
  });
}

// Dispara a sincronização em segundo plano — nunca trava a tela nem
// impede a tarefa de ser salva caso o Google esteja indisponível.
export async function sincronizarTarefaComGoogle(
  tarefaId: string,
  acao: "criar" | "atualizar" | "excluir"
) {
  try {
    await fetch("/api/google-agenda/sincronizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tarefaId, acao }),
    });
  } catch (error) {
    console.error("Falha ao sincronizar com a Google Agenda:", error);
  }
}
