import { supabase } from "@/lib/supabase";

// ===== Usuários (login) =====

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: "master" | "corretor";
  corretor_id: string | null;
  ativo: boolean;
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const resp = await fetch("/api/usuarios");
  const dados = await resp.json();
  if (!resp.ok) throw new Error(dados.error);
  return dados.usuarios as Usuario[];
}

export interface NovoUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  papel: "master" | "corretor";
  corretor_id?: string;
}

export async function criarUsuario(form: NovoUsuarioInput) {
  const resp = await fetch("/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  const dados = await resp.json();
  if (!resp.ok) throw new Error(dados.error);
}

export async function atualizarUsuario(
  id: string,
  dados: { papel?: string; ativo?: boolean }
) {
  const resp = await fetch(`/api/usuarios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  const corpo = await resp.json();
  if (!resp.ok) throw new Error(corpo.error);
}

// ===== Configurações gerais (chave/valor) =====

export async function obterConfiguracoes(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("configuracoes").select("*");

  if (error || !data) return {};

  const mapa: Record<string, string> = {};
  for (const item of data as any[]) {
    mapa[item.chave] = item.valor;
  }
  return mapa;
}

export async function salvarConfiguracao(chave: string, valor: string) {
  const { data: existente } = await supabase
    .from("configuracoes")
    .select("id")
    .eq("chave", chave)
    .maybeSingle();

  if (existente) {
    const { error } = await supabase
      .from("configuracoes")
      .update({ valor })
      .eq("chave", chave);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("configuracoes")
      .insert({ chave, valor });
    if (error) throw error;
  }
}

// ===== Minha conta =====

export async function trocarMinhaSenha(novaSenha: string) {
  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) throw error;
}

export async function atualizarMeuNome(id: string, nome: string) {
  const { error } = await supabase
    .from("usuarios")
    .update({ nome })
    .eq("id", id);
  if (error) throw error;
}
