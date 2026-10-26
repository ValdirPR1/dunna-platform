import { supabase } from "@/lib/supabase";
import { ClienteCrm, NotaCrm, TarefaCrm } from "../types";

// A segurança (cada pessoa só vê o que é seu) vem das políticas RLS do
// banco (dono_id = auth.uid()), então aqui basta consultar normalmente.

export async function listarClientes(): Promise<ClienteCrm[]> {
  const { data, error } = await supabase
    .from("meu_crm_clientes")
    .select("*")
    .eq("ativo", true)
    .order("atualizado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ClienteCrm[];
}

export type ClienteInput = Pick<
  ClienteCrm,
  "nome" | "telefone" | "email" | "origem" | "etapa" | "interesse" | "valor_estimado" | "observacoes"
>;

export async function salvarCliente(input: ClienteInput, id?: string) {
  if (id) {
    const { error } = await supabase
      .from("meu_crm_clientes")
      .update({ ...input, atualizado_em: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("meu_crm_clientes").insert(input);
  if (error) throw error;
}

export async function mudarEtapa(id: string, etapa: string) {
  const { error } = await supabase
    .from("meu_crm_clientes")
    .update({ etapa, atualizado_em: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// Remoção "suave": some das listas mas não apaga o histórico de vez
export async function arquivarCliente(id: string) {
  const { error } = await supabase
    .from("meu_crm_clientes")
    .update({ ativo: false })
    .eq("id", id);
  if (error) throw error;
}

export async function listarTarefas(): Promise<TarefaCrm[]> {
  const { data, error } = await supabase
    .from("meu_crm_tarefas")
    .select("*")
    .order("data_hora", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TarefaCrm[];
}

export async function salvarTarefa(
  input: { titulo: string; descricao?: string | null; data_hora: string; cliente_id?: string | null },
  id?: string
) {
  const dados = {
    titulo: input.titulo,
    descricao: input.descricao || null,
    data_hora: input.data_hora,
    cliente_id: input.cliente_id || null,
  };
  if (id) {
    // Mudou o horário: precisa avisar de novo
    const { error } = await supabase
      .from("meu_crm_tarefas")
      .update({ ...dados, lembrete_enviado: false })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("meu_crm_tarefas").insert(dados);
  if (error) throw error;
}

export async function alternarTarefa(id: string, concluida: boolean) {
  const { error } = await supabase
    .from("meu_crm_tarefas")
    .update({
      concluida,
      concluida_em: concluida ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function excluirTarefa(id: string) {
  const { error } = await supabase.from("meu_crm_tarefas").delete().eq("id", id);
  if (error) throw error;
}

export async function listarNotas(clienteId: string): Promise<NotaCrm[]> {
  const { data, error } = await supabase
    .from("meu_crm_notas")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NotaCrm[];
}

export async function adicionarNota(clienteId: string, texto: string) {
  const { error } = await supabase
    .from("meu_crm_notas")
    .insert({ cliente_id: clienteId, texto });
  if (error) throw error;
  await supabase
    .from("meu_crm_clientes")
    .update({ atualizado_em: new Date().toISOString() })
    .eq("id", clienteId);
}

export async function excluirNota(id: string) {
  const { error } = await supabase.from("meu_crm_notas").delete().eq("id", id);
  if (error) throw error;
}
