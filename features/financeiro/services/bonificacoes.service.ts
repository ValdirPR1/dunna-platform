import { supabase } from "@/lib/supabase";
import { Bonificacao } from "../types/admFinanceiro";

export async function listarBonificacoes(): Promise<Bonificacao[]> {
  const { data, error } = await supabase
    .from("bonificacoes")
    .select("*, corretores(nome)")
    .order("data_pagamento", { ascending: false });

  if (error || !data) return [];

  return (data as any[]).map((b) => ({
    id: b.id,
    corretor_id: b.corretor_id,
    oportunidade_id: b.oportunidade_id,
    descricao: b.descricao,
    valor: b.valor,
    data_pagamento: b.data_pagamento,
    criado_em: b.criado_em,
    corretor: b.corretores ? { nome: b.corretores.nome } : null,
  }));
}

export interface BonificacaoInput {
  corretor_id: string;
  descricao: string;
  valor: number;
  data_pagamento: string;
}

export async function criarBonificacao(form: BonificacaoInput, criadoPor: string) {
  const { error } = await supabase.from("bonificacoes").insert({
    corretor_id: form.corretor_id,
    descricao: form.descricao,
    valor: form.valor,
    data_pagamento: form.data_pagamento,
    criado_por: criadoPor,
  });

  if (error) throw error;
}

export async function excluirBonificacao(id: string) {
  const { error } = await supabase.from("bonificacoes").delete().eq("id", id);
  if (error) throw error;
}
