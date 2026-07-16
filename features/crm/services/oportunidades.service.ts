import { supabase } from "@/lib/supabase";
import { Oportunidade } from "../types/oportunidade";

export async function listarOportunidades(): Promise<Oportunidade[]> {
  const { data: oportunidades, error } = await supabase
    .from("oportunidades")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) throw error;
  if (!oportunidades || oportunidades.length === 0) return [];

  // Busca os nomes das pessoas associadas, numa segunda consulta
  // (evita depender de relacionamento configurado no Supabase).
  const pessoaIds = [
    ...new Set(oportunidades.map((o: any) => o.pessoa_id).filter(Boolean)),
  ];

  const { data: pessoas } = await supabase
    .from("pessoas")
    .select("id, nome, telefone, whatsapp")
    .in("id", pessoaIds);

  const pessoaPorId = new Map(
    (pessoas ?? []).map((p: any) => [p.id, p])
  );

  return oportunidades.map((o: any) => ({
    ...o,
    pessoa: pessoaPorId.get(o.pessoa_id) ?? null,
  }));
}

export async function atualizarEtapaOportunidade(
  id: string,
  etapa: string
) {
  const { error } = await supabase
    .from("oportunidades")
    .update({ etapa })
    .eq("id", id);

  if (error) throw error;
}
