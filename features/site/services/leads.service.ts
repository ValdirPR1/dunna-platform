import { supabase } from "@/lib/supabase";

export interface NovoLeadSite {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  origem?: string;
}

export async function criarLeadSite(lead: NovoLeadSite) {
  // 1. Cria (ou aproveita) a pessoa
  const { data: pessoa, error: erroPessoa } = await supabase
    .from("pessoas")
    .insert({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      whatsapp: lead.telefone,
      observacoes: lead.mensagem,
      ativo: true,
    })
    .select("id")
    .single();

  if (erroPessoa || !pessoa) {
    throw erroPessoa ?? new Error("Não foi possível criar a pessoa.");
  }

  // 2. Marca essa pessoa com o papel de "lead"
  const { error: erroPapel } = await supabase
    .from("pessoa_papeis")
    .insert({
      pessoa_id: pessoa.id,
      papel: "lead",
    });

  if (erroPapel) {
    throw erroPapel;
  }

  // 3. Já cria a oportunidade no Kanban, na primeira etapa
  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .insert({
      pessoa_id: pessoa.id,
      titulo: `Lead do site — ${lead.nome}`,
      etapa: "Novo Lead",
      prioridade: "Normal",
      observacoes: `${lead.mensagem} (Origem: ${lead.origem ?? "site"})`,
    });

  if (erroOportunidade) {
    throw erroOportunidade;
  }
}
