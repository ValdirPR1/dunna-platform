import { supabase } from "@/lib/supabase";
import { EmpreendimentoFormData } from "../forms/schema";

export async function listarEmpreendimentos() {
  return await supabase
    .from("empreendimentos")
    .select("*")
    .order("nome");
}

export async function buscarEmpreendimento(id: string) {
  return await supabase
    .from("empreendimentos")
    .select("*")
    .eq("id", id)
    .single();
}

export async function criarEmpreendimento(
  data: EmpreendimentoFormData
) {
  return await supabase
    .from("empreendimentos")
    .insert({
      nome: data.nome,
      construtora: data.construtora,
      incorporadora: data.incorporadora,
      cidade: data.cidade,
      bairro: data.bairro,
      endereco: data.endereco,
      descricao: data.descricao,
      status: data.status,
      publicado: data.publicado,
      slug: data.nome
        .toLowerCase()
        .replace(/\s+/g, "-"),
    })
    .select()
    .single();
}

export async function excluirEmpreendimento(id: string) {
  return await supabase
    .from("empreendimentos")
    .delete()
    .eq("id", id);
}