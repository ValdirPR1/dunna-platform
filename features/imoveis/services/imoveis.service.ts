import { supabase } from "@/lib/supabase";

export async function listarImoveis() {
  const { data, error } = await supabase
    .from("imoveis")
    .select(`
      *,
      empreendimentos (
        id,
        nome
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data ?? [];
}

export async function buscarImovel(id: string) {
  const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function criarImovel(form: any) {
  const { data, error } = await supabase
    .from("imoveis")
    .insert({
      empreendimento_id: form.empreendimentoId || null,

      titulo: form.titulo,

      codigo: form.codigo,

      tipo: form.tipo,

      origem: form.origem,

      objetivo: form.objetivo,

      status: form.status,

      quartos: Number(form.quartos || 0),

      suites: Number(form.suites || 0),

      banheiros: Number(form.banheiros || 0),

      vagas: Number(form.vagas || 0),

      area_privativa: Number(form.areaPrivativa || 0),

      area_total: Number(form.areaTotal || 0),

      preco: Number(form.preco || 0),

      comissao: Number(form.comissao || 0),

      condominio: Number(form.condominio || 0),

      iptu: Number(form.iptu || 0),

      descricao: form.descricao,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarImovel(
  id: string,
  form: any
) {
  const { data, error } = await supabase
    .from("imoveis")
    .update({
      empreendimento_id: form.empreendimentoId || null,

      titulo: form.titulo,

      codigo: form.codigo,

      tipo: form.tipo,

      origem: form.origem,

      objetivo: form.objetivo,

      status: form.status,

      quartos: Number(form.quartos || 0),

      suites: Number(form.suites || 0),

      banheiros: Number(form.banheiros || 0),

      vagas: Number(form.vagas || 0),

      area_privativa: Number(form.areaPrivativa || 0),

      area_total: Number(form.areaTotal || 0),

      preco: Number(form.preco || 0),

      comissao: Number(form.comissao || 0),

      condominio: Number(form.condominio || 0),

      iptu: Number(form.iptu || 0),

      descricao: form.descricao,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function excluirImovel(
  id: string
) {
  const { error } = await supabase
    .from("imoveis")
    .delete()
    .eq("id", id);

  if (error) throw error;
}