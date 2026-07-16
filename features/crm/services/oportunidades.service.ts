import { supabase } from "@/lib/supabase";
import { Oportunidade } from "../types/oportunidade";

export async function listarOportunidades(): Promise<Oportunidade[]> {
  const { data: oportunidades, error } = await supabase
    .from("oportunidades")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!oportunidades || oportunidades.length === 0) return [];

  // Busca os nomes das pessoas associadas, numa segunda consulta
  // (evita depender de relacionamento configurado no Supabase).
  const pessoaIds = [
    ...new Set(oportunidades.map((o: any) => o.pessoa_id).filter(Boolean)),
  ];

  const { data: pessoas } = await supabase
    .from("pessoas")
    .select("id, nome, telefone, whatsapp, email")
    .in("id", pessoaIds);

  const pessoaPorId = new Map(
    (pessoas ?? []).map((p: any) => [
      p.id,
      { ...p },
    ])
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
  const { data: oportunidade, error } = await supabase
    .from("oportunidades")
    .update({ etapa })
    .eq("id", id)
    .select("pessoa_id")
    .single();

  if (error) throw error;

  const etapasDeFechamento = ["Contrato", "Pós-venda"];

  if (etapasDeFechamento.includes(etapa) && oportunidade?.pessoa_id) {
    const { data: jaECliente } = await supabase
      .from("pessoa_papeis")
      .select("id")
      .eq("pessoa_id", oportunidade.pessoa_id)
      .eq("papel", "cliente")
      .maybeSingle();

    if (!jaECliente) {
      await supabase.from("pessoa_papeis").insert({
        pessoa_id: oportunidade.pessoa_id,
        papel: "cliente",
      });
    }
  }
}

export interface NovoLeadInput {
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  titulo: string;
  valor_interesse: string;
  prioridade: string;
  problema: string;
  corretor_id: string;
}

export async function criarLead(form: NovoLeadInput) {
  const { data: pessoa, error: erroPessoa } = await supabase
    .from("pessoas")
    .insert({
      nome: form.nome,
      email: form.email || null,
      telefone: form.telefone || null,
      whatsapp: form.whatsapp || form.telefone || null,
      ativo: true,
    })
    .select("id")
    .single();

  if (erroPessoa || !pessoa) {
    throw erroPessoa ?? new Error("Não foi possível criar a pessoa.");
  }

  const { error: erroPapel } = await supabase
    .from("pessoa_papeis")
    .insert({ pessoa_id: pessoa.id, papel: "lead" });

  if (erroPapel) throw erroPapel;

  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .insert({
      pessoa_id: pessoa.id,
      titulo: form.titulo || `Lead — ${form.nome}`,
      etapa: "Novo Lead",
      prioridade: form.prioridade || "Normal",
      valor_interesse: form.valor_interesse
        ? Number(form.valor_interesse)
        : null,
      observacoes: form.problema || null,
      corretor_id: form.corretor_id || null,
    });

  if (erroOportunidade) throw erroOportunidade;
}

export interface EditarLeadInput {
  pessoa_id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  titulo: string;
  valor_interesse: string;
  prioridade: string;
  problema: string;
  corretor_id: string;
}

export async function atualizarLead(
  oportunidadeId: string,
  form: EditarLeadInput
) {
  const { error: erroPessoa } = await supabase
    .from("pessoas")
    .update({
      nome: form.nome,
      email: form.email || null,
      telefone: form.telefone || null,
      whatsapp: form.whatsapp || null,
    })
    .eq("id", form.pessoa_id);

  if (erroPessoa) throw erroPessoa;

  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .update({
      titulo: form.titulo,
      prioridade: form.prioridade,
      valor_interesse: form.valor_interesse
        ? Number(form.valor_interesse)
        : null,
      observacoes: form.problema || null,
      corretor_id: form.corretor_id || null,
    })
    .eq("id", oportunidadeId);

  if (erroOportunidade) throw erroOportunidade;
}

export async function excluirOportunidade(id: string) {
  const { error } = await supabase
    .from("oportunidades")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
