import { supabase } from "@/lib/supabase";
import { EmpreendimentoFormData } from "../forms/schema";

function paraPayloadDoBanco(data: Partial<EmpreendimentoFormData>) {
  const payload: Record<string, unknown> = {};

  if (data.nome !== undefined) payload.nome = data.nome;
  if (data.construtora !== undefined) payload.construtora = data.construtora;
  if (data.incorporadora !== undefined)
    payload.incorporadora = data.incorporadora;
  if (data.cidade !== undefined) payload.cidade = data.cidade;
  if (data.bairro !== undefined) payload.bairro = data.bairro;
  if (data.endereco !== undefined) payload.endereco = data.endereco;
  if (data.descricao !== undefined) payload.descricao = data.descricao;
  if (data.status !== undefined) payload.status = data.status;
  if (data.publicado !== undefined) payload.publicado = data.publicado;
  if (data.tipo !== undefined) payload.tipo = data.tipo || null;
  if (data.entrega !== undefined) payload.entrega = data.entrega || null;
  if (data.registro !== undefined) payload.registro = data.registro || null;

  if (data.valorInicial !== undefined) {
    payload.valor_inicial = data.valorInicial
      ? Number(data.valorInicial)
      : null;
  }

  if (data.valorFinal !== undefined) {
    payload.valor_final = data.valorFinal ? Number(data.valorFinal) : null;
  }

  if (data.areaFinal !== undefined) {
    payload.area_final = data.areaFinal ? Number(data.areaFinal) : null;
  }

  if (data.vgv !== undefined) {
    payload.vgv = data.vgv ? Number(data.vgv) : null;
  }

  if (data.localizacaoTexto !== undefined) {
    payload.localizacao_texto = data.localizacaoTexto || null;
  }

  if (data.valorizacaoTexto !== undefined) {
    payload.valorizacao_texto = data.valorizacaoTexto || null;
  }

  return payload;
}

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
  data: EmpreendimentoFormData,
  comodidades: string[] = []
) {
  return await supabase
    .from("empreendimentos")
    .insert({
      ...paraPayloadDoBanco(data),
      comodidades,
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

export async function atualizarEmpreendimento(
  id: string,
  data: Partial<EmpreendimentoFormData>,
  comodidades?: string[]
) {
  const payload = paraPayloadDoBanco(data);

  if (comodidades !== undefined) {
    payload.comodidades = comodidades;
  }

  return await supabase
    .from("empreendimentos")
    .update(payload)
    .eq("id", id);
}