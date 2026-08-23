import toast from "react-hot-toast";
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

export function urlConectarGoogleAgenda(corretorId: string, returnTo?: string) {
  const params = new URLSearchParams({ corretor_id: corretorId });
  if (returnTo) params.set("return_to", returnTo);
  return `/api/google-agenda/conectar?${params.toString()}`;
}

export async function desconectarGoogleAgenda(corretorId: string) {
  await fetch("/api/google-agenda/desconectar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ corretorId }),
  });
}

export interface ResultadoTeste {
  ok: boolean;
  erro?: string;
}

// Cria e apaga um evento de teste na hora, pra confirmar se a conexão
// está realmente funcionando (não só "conectada" na tela).
export async function testarConexaoGoogle(
  corretorId: string
): Promise<ResultadoTeste> {
  try {
    const resposta = await fetch("/api/google-agenda/testar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ corretorId }),
    });
    return await resposta.json();
  } catch {
    return { ok: false, erro: "Não foi possível falar com o servidor agora." };
  }
}

// Dispara a sincronização em segundo plano — nunca trava a tela nem
// impede a tarefa de ser salva caso o Google esteja indisponível.
// Antes essa falha ficava só no console (ninguém via) — agora, se o
// Google recusar o pedido, mostra um aviso na tela mesmo, porque essa
// era a razão de tarefas "sumirem" sem explicação nenhuma.
export async function sincronizarTarefaComGoogle(
  tarefaId: string,
  acao: "criar" | "atualizar" | "excluir",
  // O site público também cria tarefas (visita agendada por um
  // visitante) e chama essa mesma função — nesse caso o aviso de erro
  // não pode aparecer pra quem tá visitando o site, só faz sentido
  // dentro do painel, pro próprio corretor.
  opcoes?: { silencioso?: boolean }
) {
  try {
    const resposta = await fetch("/api/google-agenda/sincronizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tarefaId, acao }),
    });

    const dados = await resposta.json().catch(() => null);

    if (
      !opcoes?.silencioso &&
      dados &&
      dados.ok === false &&
      dados.motivo !== "nao_conectado"
    ) {
      toast.error(
        `Não sincronizou com a Google Agenda: ${dados.erro ?? "erro desconhecido"}`
      );
    }
  } catch (error) {
    console.error("Falha ao sincronizar com a Google Agenda:", error);
    if (!opcoes?.silencioso) {
      toast.error("Não foi possível falar com a Google Agenda agora.");
    }
  }
}
