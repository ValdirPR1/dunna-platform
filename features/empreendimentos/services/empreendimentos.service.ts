import { supabase } from "@/lib/supabase";

export async function listarEmpreendimentos() {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function buscarEmpreendimento(id: string) {
  const { data, error } = await supabase
    .from("empreendimentos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function criarEmpreendimento(form: any) {
  const { data, error } = await supabase
    .from("empreendimentos")
    .insert({
      nome: form.nome,
      cidade: form.cidade,
      bairro: form.bairro,
      estado: form.estado,
      construtora: form.construtora,
      incorporadora: form.incorporadora,
      tipo: form.tipo,
      status: form.status,
      valor_inicial: Number(form.valorInicial || 0),
      valor_final: Number(form.valorFinal || 0),
      area_inicial: Number(form.areaInicial || 0),
      area_final: Number(form.areaFinal || 0),
      vgv: Number(form.vgv || 0),
      descricao: form.descricao,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarEmpreendimento(
  id: string,
  form: any
) {
  console.log("========== UPDATE ==========");
  console.log("ID:", id);
  console.log("FORM:", form);

  const { data, error } = await supabase
    .from("empreendimentos")
    .update({
      nome: form.nome,
      cidade: form.cidade,
      bairro: form.bairro,
      estado: form.estado,
      construtora: form.construtora,
      incorporadora: form.incorporadora,
      tipo: form.tipo,
      status: form.status,
      valor_inicial: Number(form.valorInicial || 0),
      valor_final: Number(form.valorFinal || 0),
      area_inicial: Number(form.areaInicial || 0),
      area_final: Number(form.areaFinal || 0),
      vgv: Number(form.vgv || 0),
      descricao: form.descricao,
    })
    .eq("id", id)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) throw error;

  return data?.[0];
}

export async function excluirEmpreendimento(
  id: string
) {
  const { error } = await supabase
    .from("empreendimentos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
export async function publicarEmpreendimento(
  id: string,
  publicado: boolean
) {
  const { error } = await supabase
    .from("empreendimentos")
    .update({
      publicado,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function destacarEmpreendimento(
  id: string,
  destaque: boolean
) {
  const { error } = await supabase
    .from("empreendimentos")
    .update({
      destaque,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function ativarEmpreendimento(
  id: string,
  ativo: boolean
) {
  const { error } = await supabase
    .from("empreendimentos")
    .update({
      ativo,
    })
    .eq("id", id);

  if (error) throw error;
}