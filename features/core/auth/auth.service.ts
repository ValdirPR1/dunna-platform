import { supabase } from "@/lib/supabase";

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  papel: "master" | "corretor";
  corretor_id: string | null;
}

export async function login(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function buscarUsuarioLogado(): Promise<UsuarioLogado | null> {
  const { data: sessao } = await supabase.auth.getUser();

  if (!sessao.user) return null;

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, nome, email, papel, corretor_id")
    .eq("id", sessao.user.id)
    .single();

  if (!usuario) return null;

  // Se o e-mail de login (Supabase Auth) já mudou mas a cópia em
  // "usuarios" ainda não foi atualizada — caso de uma troca de e-mail
  // que acabou de ser confirmada — sincroniza aqui. Evita ter que
  // corrigir isso manualmente e mantém a listagem de usuários certa.
  if (sessao.user.email && sessao.user.email !== usuario.email) {
    await supabase
      .from("usuarios")
      .update({ email: sessao.user.email })
      .eq("id", sessao.user.id);
    usuario.email = sessao.user.email;
  }

  return usuario as UsuarioLogado;
}
