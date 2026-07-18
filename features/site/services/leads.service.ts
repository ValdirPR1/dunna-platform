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

export interface NovaVisitaSite {
  nome: string;
  telefone: string;
  dataPreferida: string;
  periodo: "Manhã" | "Tarde" | "Noite";
  imovelTitulo: string;
  corretorId?: string | null;
}

const HORARIO_POR_PERIODO: Record<string, string> = {
  "Manhã": "09:00",
  "Tarde": "14:00",
  "Noite": "18:00",
};

// Cria o lead + já agenda a visita como tarefa na Agenda do corretor
// responsável por esse imóvel, sem precisar de nenhum passo manual.
export async function criarSolicitacaoVisita(dados: NovaVisitaSite) {
  const { data: pessoa, error: erroPessoa } = await supabase
    .from("pessoas")
    .insert({
      nome: dados.nome,
      telefone: dados.telefone,
      whatsapp: dados.telefone,
      observacoes: `Solicitou visita ao imóvel: ${dados.imovelTitulo}`,
      ativo: true,
    })
    .select("id")
    .single();

  if (erroPessoa || !pessoa) {
    throw erroPessoa ?? new Error("Não foi possível registrar seus dados.");
  }

  await supabase.from("pessoa_papeis").insert({
    pessoa_id: pessoa.id,
    papel: "lead",
  });

  const { data: oportunidade, error: erroOportunidade } = await supabase
    .from("oportunidades")
    .insert({
      pessoa_id: pessoa.id,
      corretor_id: dados.corretorId ?? null,
      titulo: `Visita agendada — ${dados.imovelTitulo}`,
      etapa: "Novo Lead",
      prioridade: "Alta",
      observacoes: `Solicitação de visita via site. Imóvel: ${dados.imovelTitulo}. Data preferida: ${dados.dataPreferida} (${dados.periodo}).`,
    })
    .select("id")
    .single();

  if (erroOportunidade || !oportunidade) {
    throw erroOportunidade ?? new Error("Não foi possível agendar a visita.");
  }

  const horario = HORARIO_POR_PERIODO[dados.periodo] ?? "09:00";

  const { error: erroTarefa } = await supabase.from("tarefas").insert({
    corretor_id: dados.corretorId ?? null,
    oportunidade_id: oportunidade.id,
    tipo: "Visita",
    titulo: `Visita: ${dados.imovelTitulo}`,
    data_hora: `${dados.dataPreferida}T${horario}:00`,
    concluida: false,
    observacoes: `Visita solicitada pelo site para o período da ${dados.periodo.toLowerCase()}.`,
  });

  if (erroTarefa) {
    throw erroTarefa;
  }
}
