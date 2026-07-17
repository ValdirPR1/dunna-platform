import { supabase } from "@/lib/supabase";

export const STATUS_CONTRATO = ["Rascunho", "Enviado", "Assinado"] as const;

export interface ContratoNegocio {
  oportunidadeId: string;
  contratoId: string | null;
  titulo: string;
  pessoaNome: string;
  corretorNome: string | null;
  valorNegociado: number;
  status: string;
  dataAssinatura: string | null;
  arquivoUrl: string | null;
  valorFinal: number | null;
}

const ETAPAS_FECHADAS = ["Contrato", "Pós-venda"];

export async function listarContratos(): Promise<ContratoNegocio[]> {
  const { data: oportunidades, error } = await supabase
    .from("oportunidades")
    .select(
      "id, titulo, valor_previsto, valor_interesse, pessoas(nome), corretores(nome)"
    )
    .in("etapa", ETAPAS_FECHADAS)
    .order("created_at", { ascending: false });

  if (error || !oportunidades) return [];

  const oportunidadeIds = oportunidades.map((o: any) => o.id);

  const { data: contratos } = await supabase
    .from("contratos")
    .select("*")
    .in("oportunidade_id", oportunidadeIds);

  const mapaContratos = new Map(
    (contratos ?? []).map((c: any) => [c.oportunidade_id, c])
  );

  return (oportunidades as any[]).map((o) => {
    const contrato = mapaContratos.get(o.id);

    return {
      oportunidadeId: o.id,
      contratoId: contrato?.id ?? null,
      titulo: o.titulo,
      pessoaNome: o.pessoas?.nome ?? "—",
      corretorNome: o.corretores?.nome ?? null,
      valorNegociado: Number(o.valor_previsto ?? o.valor_interesse ?? 0),
      status: contrato?.status ?? "Rascunho",
      dataAssinatura: contrato?.data_assinatura ?? null,
      arquivoUrl: contrato?.arquivo_url ?? null,
      valorFinal: contrato?.valor_final ?? null,
    };
  });
}

export async function salvarContrato(
  oportunidadeId: string,
  dados: {
    status?: string;
    data_assinatura?: string | null;
    arquivo_url?: string | null;
    valor_final?: number | null;
  }
) {
  const { data: existente } = await supabase
    .from("contratos")
    .select("id")
    .eq("oportunidade_id", oportunidadeId)
    .maybeSingle();

  if (existente) {
    const { error } = await supabase
      .from("contratos")
      .update(dados)
      .eq("oportunidade_id", oportunidadeId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("contratos")
      .insert({ oportunidade_id: oportunidadeId, ...dados });
    if (error) throw error;
  }
}

export async function uploadArquivoContrato(
  oportunidadeId: string,
  file: File
): Promise<string> {
  const caminho = `${oportunidadeId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("contratos")
    .upload(caminho, file);

  if (error) throw error;

  const { data } = supabase.storage.from("contratos").getPublicUrl(caminho);

  return data.publicUrl;
}
