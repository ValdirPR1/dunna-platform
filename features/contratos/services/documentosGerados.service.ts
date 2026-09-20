import { supabase } from "@/lib/supabase";

export type TipoDocumentoGerado = "contrato_compra_venda" | "autorizacao_venda";

export interface DocumentoGeradoResumo {
  id: string;
  titulo: string;
  atualizado_em: string;
}

// Lista os rascunhos salvos de um tipo de documento (mais recente
// primeiro), só com o essencial pra montar um seletor — os dados
// completos só são buscados quando o rascunho é de fato carregado.
export async function listarDocumentosGerados(
  tipo: TipoDocumentoGerado
): Promise<DocumentoGeradoResumo[]> {
  const { data, error } = await supabase
    .from("documentos_gerados")
    .select("id, titulo, atualizado_em")
    .eq("tipo", tipo)
    .order("atualizado_em", { ascending: false });

  if (error || !data) return [];
  return data as DocumentoGeradoResumo[];
}

export async function carregarDocumentoGerado<T>(id: string): Promise<T | null> {
  const { data, error } = await supabase
    .from("documentos_gerados")
    .select("dados")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data.dados as T;
}

// Cria (se rascunhoId for null) ou atualiza um rascunho existente,
// devolvendo o id — pra continuar salvando por cima nas próximas
// vezes, sem duplicar.
export async function salvarDocumentoGerado(
  rascunhoId: string | null,
  tipo: TipoDocumentoGerado,
  titulo: string,
  dados: unknown,
  usuarioId: string
): Promise<string> {
  if (rascunhoId) {
    const { error } = await supabase
      .from("documentos_gerados")
      .update({ titulo, dados, atualizado_em: new Date().toISOString() })
      .eq("id", rascunhoId);

    if (error) throw error;
    return rascunhoId;
  }

  const { data, error } = await supabase
    .from("documentos_gerados")
    .insert({ tipo, titulo, dados, criado_por: usuarioId })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function excluirDocumentoGerado(id: string) {
  const { error } = await supabase.from("documentos_gerados").delete().eq("id", id);
  if (error) throw error;
}
