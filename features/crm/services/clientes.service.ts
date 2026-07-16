import { supabase } from "@/lib/supabase";

export interface Cliente {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  whatsapp: string | null;
  cidade: string | null;
}

export async function listarClientes(): Promise<Cliente[]> {
  const { data: papeis, error } = await supabase
    .from("pessoa_papeis")
    .select("pessoa_id")
    .eq("papel", "cliente");

  if (error || !papeis || papeis.length === 0) return [];

  const pessoaIds = papeis.map((p: any) => p.pessoa_id);

  const { data: pessoas } = await supabase
    .from("pessoas")
    .select("id, nome, telefone, email, whatsapp, cidade")
    .in("id", pessoaIds)
    .order("nome");

  return (pessoas ?? []) as Cliente[];
}

export async function buscarCliente(id: string) {
  const { data, error } = await supabase
    .from("pessoas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export interface NovoClienteInput {
  nome: string;
  telefone: string;
  email: string;
  whatsapp: string;
}

export async function criarCliente(form: NovoClienteInput) {
  const { data: pessoa, error } = await supabase
    .from("pessoas")
    .insert({
      nome: form.nome,
      telefone: form.telefone || null,
      email: form.email || null,
      whatsapp: form.whatsapp || form.telefone || null,
      ativo: true,
    })
    .select("id")
    .single();

  if (error || !pessoa) throw error;

  const { error: erroPapel } = await supabase
    .from("pessoa_papeis")
    .insert({ pessoa_id: pessoa.id, papel: "cliente" });

  if (erroPapel) throw erroPapel;
}

export async function listarHistoricoCliente(pessoaId: string) {
  const { data, error } = await supabase
    .from("oportunidades")
    .select("id, titulo, etapa, valor_previsto, valor_interesse, created_at")
    .eq("pessoa_id", pessoaId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}
