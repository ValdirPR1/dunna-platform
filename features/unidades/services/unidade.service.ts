import { supabase } from "@/lib/supabase";

export async function listarUnidades(
  empreendimentoId: string
) {
  const { data, error } = await supabase
    .from("unidades")
    .select("*")
    .eq("empreendimento_id", empreendimentoId)
    .order("numero");

  if (error) throw error;

  return data ?? [];
}

export async function criarUnidade(form: any) {
  const { data, error } = await supabase
    .from("unidades")
    .insert({
      empreendimento_id: form.empreendimentoId,

      numero: form.numero,

      bloco: form.bloco,

      torre: form.torre,

      andar: Number(form.andar),

      tipologia: form.tipologia,

      status: form.status,

      quartos: Number(form.quartos),

      suites: Number(form.suites),

      banheiros: Number(form.banheiros),

      vagas: Number(form.vagas),

      area_privativa: Number(form.areaPrivativa),

      area_total: Number(form.areaTotal),

      preco_tabela: Number(form.precoTabela),

      preco_promocional: Number(form.precoPromocional),

      comissao: Number(form.comissao),

      posicao_solar: form.posicaoSolar,

      vista: form.vista,

      observacoes: form.observacoes,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function excluirUnidade(
  id: string
) {
  const { error } = await supabase
    .from("unidades")
    .delete()
    .eq("id", id);

  if (error) throw error;
}