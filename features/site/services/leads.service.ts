import { supabase } from "@/lib/supabase";
import {
  notificarNovoLead,
  notificarCorretorSobreLead,
} from "@/features/notificacoes/services/emailNotificacao.service";
import {
  notificarNovoLeadPush,
  notificarCorretorSobreLeadPush,
} from "@/features/notificacoes/services/pushNotificacao.service";
import { sincronizarTarefaComGoogle } from "@/features/agenda/services/googleAgenda.service";

export interface NovoLeadSite {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  origem?: string;
}

export async function criarLeadSite(lead: NovoLeadSite) {
  // 1. Cria (ou aproveita) a pessoa
  //
  // Importante: o site público usa a chave anônima (sem login), que só
  // tem permissão de INSERT em "pessoas" — de propósito não tem
  // permissão de leitura (senão qualquer um com a chave anônima
  // conseguiria listar nome/telefone/e-mail de todos os leads). Por
  // isso NÃO podemos encadear ".select().single()" depois do insert:
  // isso faz o Supabase pedir a linha de volta (RETURNING), e o
  // Postgres exige a mesma permissão de leitura pra devolver essa
  // linha — o que a chave anônima não tem, e o insert falha com um
  // erro de RLS mesmo estando tudo certo. Gerando o id aqui mesmo (no
  // servidor) e mandando ele já no insert, a gente já sabe o id sem
  // precisar pedir ele de volta.
  const idPessoa = crypto.randomUUID();
  const { error: erroPessoa } = await supabase.from("pessoas").insert({
    id: idPessoa,
    nome: lead.nome,
    email: lead.email,
    telefone: lead.telefone,
    whatsapp: lead.telefone,
    observacoes: lead.mensagem,
    ativo: true,
  });

  if (erroPessoa) {
    throw erroPessoa;
  }

  // 2. Marca essa pessoa com o papel de "lead"
  const { error: erroPapel } = await supabase
    .from("pessoa_papeis")
    .insert({
      pessoa_id: idPessoa,
      papel: "lead",
    });

  if (erroPapel) {
    throw erroPapel;
  }

  // 2.5 Escolhe automaticamente qual corretor fica responsável por
  // esse lead, em rodízio entre os corretores ativos (ver função
  // "escolher_corretor_round_robin" na migração
  // 20260806_distribuicao_automatica_leads_site.sql). Se não houver
  // nenhum corretor ativo, o lead fica sem responsável mesmo — igual
  // ao comportamento anterior.
  const { data: corretorId } = await supabase.rpc(
    "escolher_corretor_round_robin"
  );

  // 3. Já cria a oportunidade no Kanban, na primeira etapa
  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .insert({
      pessoa_id: idPessoa,
      titulo: `Lead do site — ${lead.nome}`,
      etapa: "Novo Lead",
      prioridade: "Normal",
      observacoes: `${lead.mensagem} (Origem: ${lead.origem ?? "site"})`,
      corretor_id: corretorId ?? null,
    });

  if (erroOportunidade) {
    throw erroOportunidade;
  }

  await notificarNovoLead({
    nome: lead.nome,
    origem: lead.origem ?? "site",
    telefone: lead.telefone,
    observacoes: lead.mensagem,
  });
  await notificarNovoLeadPush({ nome: lead.nome });

  if (corretorId) {
    await notificarCorretorSobreLead(corretorId, {
      nomeLead: lead.nome,
      titulo: `Lead do site — ${lead.nome}`,
    });
    await notificarCorretorSobreLeadPush(corretorId, {
      nomeLead: lead.nome,
    });
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
  // Mesmo motivo do criarLeadSite: gera os ids aqui e não usa
  // ".select()" depois do insert, porque a chave anônima do site não
  // tem (e não deve ter) permissão de leitura em pessoas/oportunidades.
  const idPessoa = crypto.randomUUID();
  const { error: erroPessoa } = await supabase.from("pessoas").insert({
    id: idPessoa,
    nome: dados.nome,
    telefone: dados.telefone,
    whatsapp: dados.telefone,
    observacoes: `Solicitou visita ao imóvel: ${dados.imovelTitulo}`,
    ativo: true,
  });

  if (erroPessoa) {
    throw erroPessoa;
  }

  await supabase.from("pessoa_papeis").insert({
    pessoa_id: idPessoa,
    papel: "lead",
  });

  const idOportunidade = crypto.randomUUID();
  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .insert({
      id: idOportunidade,
      pessoa_id: idPessoa,
      corretor_id: dados.corretorId ?? null,
      titulo: `Visita agendada — ${dados.imovelTitulo}`,
      etapa: "Novo Lead",
      prioridade: "Alta",
      observacoes: `Solicitação de visita via site. Imóvel: ${dados.imovelTitulo}. Data preferida: ${dados.dataPreferida} (${dados.periodo}).`,
    });

  if (erroOportunidade) {
    throw erroOportunidade;
  }

  const horario = HORARIO_POR_PERIODO[dados.periodo] ?? "09:00";

  // Mesmo motivo do "id da pessoa" acima: gera o id aqui (em vez de
  // pedir de volta com .select()) porque a chave anônima do site não
  // tem permissão de leitura em "tarefas".
  const idTarefa = crypto.randomUUID();

  const { error: erroTarefa } = await supabase.from("tarefas").insert({
    id: idTarefa,
    corretor_id: dados.corretorId ?? null,
    oportunidade_id: idOportunidade,
    tipo: "Visita",
    titulo: `Visita: ${dados.imovelTitulo}`,
    data_hora: new Date(
      `${dados.dataPreferida}T${horario}:00`
    ).toISOString(),
    concluida: false,
    observacoes: `Visita solicitada pelo site para o período da ${dados.periodo.toLowerCase()}.`,
  });

  if (erroTarefa) {
    throw erroTarefa;
  }

  // Essa visita já nasce com data/hora marcada — se o corretor
  // responsável tiver a Google Agenda conectada, sincroniza igual às
  // tarefas criadas por dentro do sistema (antes isso não acontecia:
  // visitas agendadas pelo site nunca apareciam na Google Agenda do
  // corretor, só dentro do CRM).
  if (dados.corretorId) {
    sincronizarTarefaComGoogle(idTarefa, "criar", { silencioso: true }).catch(
      () => {}
    );
  }

  await notificarNovoLead({
    nome: dados.nome,
    origem: `Agendamento de visita — ${dados.imovelTitulo}`,
    telefone: dados.telefone,
    observacoes: `Data preferida: ${dados.dataPreferida} (${dados.periodo})`,
  });
  await notificarNovoLeadPush({ nome: dados.nome });

  if (dados.corretorId) {
    await notificarCorretorSobreLead(dados.corretorId, {
      nomeLead: dados.nome,
      titulo: `Visita: ${dados.imovelTitulo}`,
    });
    await notificarCorretorSobreLeadPush(dados.corretorId, {
      nomeLead: dados.nome,
    });
  }
}

export interface NovoLeadVendedor {
  nome: string;
  telefone: string;
  email?: string;
  cidade: string;
  bairro?: string;
  tipoImovel: string;
  quartos?: string;
  valorPretendido?: string;
  observacoes?: string;
}

// Lead de quem quer VENDER um imóvel com a Dunna (diferente do lead de
// quem quer comprar) — fica bem marcado no título e na observação pra
// a equipe identificar de cara no Kanban.
export async function criarLeadVendedor(dados: NovoLeadVendedor) {
  const idPessoa = crypto.randomUUID();
  const { error: erroPessoa } = await supabase.from("pessoas").insert({
    id: idPessoa,
    nome: dados.nome,
    email: dados.email ?? null,
    telefone: dados.telefone,
    whatsapp: dados.telefone,
    cidade: dados.cidade,
    bairro: dados.bairro ?? null,
    observacoes: dados.observacoes ?? null,
    ativo: true,
  });

  if (erroPessoa) {
    throw erroPessoa;
  }

  await supabase.from("pessoa_papeis").insert({
    pessoa_id: idPessoa,
    papel: "lead",
  });

  const detalhesImovel = [
    dados.tipoImovel,
    dados.quartos ? `${dados.quartos} quartos` : null,
    dados.bairro,
    dados.cidade,
  ]
    .filter(Boolean)
    .join(" • ");

  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .insert({
      pessoa_id: idPessoa,
      titulo: `🏷️ QUER VENDER — ${dados.nome}`,
      etapa: "Novo Lead",
      prioridade: "Alta",
      valor_interesse: dados.valorPretendido
        ? Number(dados.valorPretendido)
        : null,
      observacoes: `Pessoa interessada em VENDER um imóvel com a Dunna. Imóvel: ${detalhesImovel}. Valor pretendido: ${
        dados.valorPretendido
          ? `R$ ${Number(dados.valorPretendido).toLocaleString("pt-BR")}`
          : "não informado"
      }. ${dados.observacoes ?? ""}`,
    });

  if (erroOportunidade) {
    throw erroOportunidade;
  }

  await notificarNovoLead({
    nome: dados.nome,
    origem: "Quer vender um imóvel (site)",
    telefone: dados.telefone,
    observacoes: detalhesImovel,
  });
  await notificarNovoLeadPush({ nome: dados.nome });
}
