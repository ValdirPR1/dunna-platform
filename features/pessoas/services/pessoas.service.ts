import { supabase } from "@/lib/supabase";

import { Pessoa } from "../types/pessoa";
import { PessoaFormData } from "../types/pessoaForm";

export async function listarPessoas(): Promise<Pessoa[]> {

  const { data, error } = await supabase

    .from("pessoas")

    .select("*")

    .order("nome");

  if (error) throw error;

  return data ?? [];

}

export async function buscarPessoa(
  id: string
): Promise<Pessoa> {

  const { data, error } = await supabase

    .from("pessoas")

    .select("*")

    .eq("id", id)

    .single();

  if (error) throw error;

  return data;

}

export async function criarPessoa(
  form: PessoaFormData
): Promise<Pessoa> {

  const { data, error } = await supabase

    .from("pessoas")

    .insert(form)

    .select()

    .single();

  if (error) throw error;

  return data;

}

export async function atualizarPessoa(

  id: string,

  form: PessoaFormData

): Promise<Pessoa> {

  const { data, error } = await supabase

    .from("pessoas")

    .update(form)

    .eq("id", id)

    .select()

    .single();

  if (error) throw error;

  return data;

}

export async function excluirPessoa(
  id: string
) {

  const { error } = await supabase

    .from("pessoas")

    .delete()

    .eq("id", id);

  if (error) throw error;

}