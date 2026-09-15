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
    pago: c.pago ?? false,
    pago_em: c.pago_em,
    parcelas_recebidas: c.parcelas_recebidas ?? 0,
    parcelas_pagas_corretor: c.parcelas_pagas_corretor ?? 0,
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

// Corrige o valor da venda depois do contrato já assinado (ex: digitou
// errado na hora de confirmar). Precisa atualizar os dois lugares: a
// oportunidade (fonte do VGV/gráficos do Financeiro e do Funil
// Comercial) e a própria comissão (base do cálculo dos percentuais) —
// senão os dois ficam mostrando valores diferentes pra mesma venda.
export async function corrigirValorVenda(
  comissaoId: string,
  oportunidadeId: string,
  novoValor: number
) {
  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .update({ valor_venda: novoValor })
    .eq("id", oportunidadeId);

  if (erroOportunidade) throw erroOportunidade;

  const { error: erroComissao } = await supabase
    .from("comissoes")
    .update({ valor_venda: novoValor })
    .eq("id", comissaoId);

  if (erroComissao) throw erroComissao;
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
//
// À vista já entra como recebida/paga de uma vez (não precisa clicar
// em mais nada, igual sempre foi). Parcelada começa zerada — o valor só
// aparece no Financeiro conforme cada parcela é marcada como recebida
// (ver marcarParcelasRecebidas/marcarParcelasPagasCorretor).
//
// Se a comissão já estava "definida" antes (o master está só
// reeditando), preserva o que já tinha sido marcado como
// recebido/pago, só limitando ao novo número de parcelas.
export async function definirComissao(
  id: string,
  valorVenda: number,
  form: DefinirComissaoInput,
  atualizadoPor: string,
  comissaoAnterior?: Comissao | null
) {
  const valorComissaoImobiliaria = valorVenda * (form.percentual_imobiliaria / 100);
  const valorComissaoCorretor = valorComissaoImobiliaria * (form.percentual_corretor / 100);
  const novasParcelas = form.forma_recebimento === "parcelado" ? form.parcelas || 1 : 1;
  const jaEstavaDefinida = comissaoAnterior?.status === "definida";

  const parcelasRecebidas = jaEstavaDefinida
    ? Math.min(comissaoAnterior?.parcelas_recebidas ?? 0, novasParcelas)
    : form.forma_recebimento === "avista"
      ? 1
      : 0;

  const parcelasPagasCorretor = jaEstavaDefinida
    ? Math.min(comissaoAnterior?.parcelas_pagas_corretor ?? 0, novasParcelas)
    : 0;

  const corretorQuitado = parcelasPagasCorretor >= novasParcelas;

  const { error } = await supabase
    .from("comissoes")
    .update({
      percentual_imobiliaria: form.percentual_imobiliaria,
      valor_comissao_imobiliaria: valorComissaoImobiliaria,
      percentual_corretor: form.percentual_corretor,
      valor_comissao_corretor: valorComissaoCorretor,
      forma_recebimento: form.forma_recebimento,
      parcelas: novasParcelas,
      parcelas_recebidas: parcelasRecebidas,
      parcelas_pagas_corretor: parcelasPagasCorretor,
      pago: corretorQuitado,
      pago_em: corretorQuitado ? (comissaoAnterior?.pago_em ?? new Date().toISOString().slice(0, 10)) : null,
      observacoes: form.observacoes || null,
      status: "definida",
      atualizado_por: atualizadoPor,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

// Marca quantas parcelas da comissão da imobiliária já entraram de
// fato (o que o cliente pagou pra imobiliária) — é esse valor
// proporcional, não o total da comissão, que conta como receita no
// Financeiro (ver valorRecebidoImobiliaria).
export async function marcarParcelasRecebidas(id: string, parcelasRecebidas: number) {
  const { error } = await supabase
    .from("comissoes")
    .update({ parcelas_recebidas: parcelasRecebidas })
    .eq("id", id);

  if (error) throw error;
}

// Marca quantas parcelas já foram repassadas ao corretor de fato —
// é esse valor proporcional que conta como saída de caixa no ADM
// Financeiro (ver valorPagoCorretor). "pago"/"pago_em" continuam
// existindo só pra manter compatível o selo "Pago"/"Pendente" de
// quando a comissão é à vista (1 parcela só).
export async function marcarParcelasPagasCorretor(
  id: string,
  parcelasPagas: number,
  totalParcelas: number
) {
  const completo = totalParcelas > 0 && parcelasPagas >= totalParcelas;

  const { error } = await supabase
    .from("comissoes")
    .update({
      parcelas_pagas_corretor: parcelasPagas,
      pago: completo,
      pago_em: parcelasPagas > 0 ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", id);

  if (error) throw error;
}

// Valor que já entrou de fato pra imobiliária, proporcional às
// parcelas já recebidas — é isso (não valor_comissao_imobiliaria
// direto) que deve alimentar qualquer soma de receita no Financeiro.
export function valorRecebidoImobiliaria(c: Comissao): number {
  if (c.status !== "definida") return 0;
  const total = c.valor_comissao_imobiliaria ?? 0;
  const parcelas = c.parcelas || 1;
  const recebidas = Math.min(c.parcelas_recebidas ?? 0, parcelas);
  return total * (recebidas / parcelas);
}

// Valor que já foi de fato repassado ao corretor, proporcional às
// parcelas já pagas.
export function valorPagoCorretor(c: Comissao): number {
  if (c.status !== "definida") return 0;
  const total = c.valor_comissao_corretor ?? 0;
  const parcelas = c.parcelas || 1;
  const pagas = Math.min(c.parcelas_pagas_corretor ?? 0, parcelas);
  return total * (pagas / parcelas);
}
