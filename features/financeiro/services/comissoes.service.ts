import { supabase } from "@/lib/supabase";
import { Comissao, FormaRecebimento } from "../types/comissao";

export async function listarComissoes(): Promise<Comissao[]> {
  const { data, error } = await supabase
    .from("comissoes")
    .select("*, oportunidades(titulo, pessoa_id), corretores(nome)")
    .order("criado_em", { ascending: false });

  if (error || !data) return [];

  const pessoaIds = [
    ...new Set(
      (data as any[]).map((c) => c.oportunidades?.pessoa_id).filter(Boolean)
    ),
  ];

  const { data: pessoas } =
    pessoaIds.length > 0
      ? await supabase.from("pessoas").select("id, nome").in("id", pessoaIds)
      : { data: [] as { id: string; nome: string }[] };

  const nomePorPessoaId = new Map((pessoas ?? []).map((p: any) => [p.id, p.nome]));

  return (data as any[]).map((c) => ({
    id: c.id,
    oportunidade_id: c.oportunidade_id,
    corretor_id: c.corretor_id,
    valor_venda: c.valor_venda,
    percentual_imobiliaria: c.percentual_imobiliaria,
    valor_comissao_imobiliaria: c.valor_comissao_imobiliaria,
    percentual_corretor: c.percentual_corretor,
    valor_comissao_corretor: c.valor_comissao_corretor,
    forma_recebimento: c.forma_recebimento,
    parcelas: c.parcelas,
    observacoes: c.observacoes,
    status: c.status,
    criado_em: c.criado_em,
    atualizado_em: c.atualizado_em,
    oportunidade: c.oportunidades
      ? {
          titulo: c.oportunidades.titulo,
          pessoaNome: nomePorPessoaId.get(c.oportunidades.pessoa_id) ?? null,
        }
      : null,
    corretor: c.corretores ? { nome: c.corretores.nome } : null,
  }));
}

export interface DefinirComissaoInput {
  percentual_imobiliaria: number;
  percentual_corretor: number;
  forma_recebimento: FormaRecebimento;
  parcelas: number;
  observacoes: string;
}

// Calcula os valores em cima do valor da venda já confirmado
// (congelado no momento do "Contrato Assinado") e salva a comissão
// como "definida".
export async function definirComissao(
  id: string,
  valorVenda: number,
  form: DefinirComissaoInput,
  atualizadoPor: string
) {
  const valorComissaoImobiliaria = valorVenda * (form.percentual_imobiliaria / 100);
  const valorComissaoCorretor = valorComissaoImobiliaria * (form.percentual_corretor / 100);

  const { error } = await supabase
    .from("comissoes")
    .update({
      percentual_imobiliaria: form.percentual_imobiliaria,
      valor_comissao_imobiliaria: valorComissaoImobiliaria,
      percentual_corretor: form.percentual_corretor,
      valor_comissao_corretor: valorComissaoCorretor,
      forma_recebimento: form.forma_recebimento,
      parcelas: form.forma_recebimento === "parcelado" ? form.parcelas || 1 : 1,
      observacoes: form.observacoes || null,
      status: "definida",
      atualizado_por: atualizadoPor,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
