import { supabase } from "@/lib/supabase";
import {
  notificarNovoLead,
  notificarCorretorSobreLead,
} from "@/features/notificacoes/services/emailNotificacao.service";
import {
  notificarNovoLeadPush,
  notificarCorretorSobreLeadPush,
} from "@/features/notificacoes/services/pushNotificacao.service";
import { Oportunidade } from "../types/oportunidade";

// A regra no banco só deixa um corretor criar/editar leads que ficam
// atribuídos a ele mesmo (comparando com o corretor_id vinculado ao
// login dele). Se esse vínculo estiver quebrado ou o corretor
// escolhido no formulário for outro que não o do usuário logado, o
// Postgres recusa com o código 42501 — troca isso por uma mensagem
// que a pessoa consegue agir, em vez do erro técnico cru.
function traduzirErroPermissao(error: { code?: string; message?: string }) {
  if (error?.code === "42501") {
    return new Error(
      "Esse login de corretor não está corretamente vinculado a um cadastro de corretor (ou o lead foi atribuído a outro corretor). Peça pro administrador conferir em Corretores → Usuários, ou saia e entre de novo no sistema."
    );
  }
  return error;
}

export async function contarOportunidadesAtivas(): Promise<number> {
  const { count } = await supabase
    .from("oportunidades")
    .select("id", { count: "exact", head: true })
    .eq("perdido", false);

  return count ?? 0;
}

export async function listarOportunidades(): Promise<Oportunidade[]> {
  const { data: oportunidades, error } = await supabase
    .from("oportunidades")
    .select("*")
    .eq("perdido", false)
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

  // Mesma lógica pra buscar o nome do corretor responsável por cada
  // lead (segunda consulta, mesmo padrão usado acima pra "pessoas").
  const corretorIds = [
    ...new Set(oportunidades.map((o: any) => o.corretor_id).filter(Boolean)),
  ];

  const { data: corretores } =
    corretorIds.length > 0
      ? await supabase.from("corretores").select("id, nome").in("id", corretorIds)
      : { data: [] as { id: string; nome: string }[] };

  const corretorPorId = new Map(
    (corretores ?? []).map((c: any) => [c.id, { nome: c.nome }])
  );

  return oportunidades.map((o: any) => ({
    ...o,
    pessoa: pessoaPorId.get(o.pessoa_id) ?? null,
    corretor: corretorPorId.get(o.corretor_id) ?? null,
  }));
}

// Mover pra "Pós-venda" por aqui (drag-and-drop ou edição manual) não
// é permitido — essa etapa só pode ser alcançada confirmando o
// contrato assinado (ver confirmarContratoAssinado). Isso vale tanto
// pro corretor quanto pro master.
export async function atualizarEtapaOportunidade(
  id: string,
  etapa: string
) {
  if (etapa === "Pós-venda") {
    throw new Error(
      "Pós-venda só é alcançada confirmando o contrato assinado, pelo botão no card."
    );
  }

  const payload: Record<string, unknown> = {
    etapa,
    atualizado_em: new Date().toISOString(),
    // Se o card estava em Pós-venda e foi movido de volta (correção
    // manual), a venda deixa de contar como fechada nas métricas.
    venda_fechada_em: null,
  };

  const { error } = await supabase
    .from("oportunidades")
    .update(payload)
    .eq("id", id);

  if (error) throw error;
}

// Único caminho válido pra uma oportunidade virar venda de verdade:
// o corretor (ou o master) confirma que o contrato foi assinado e
// informa o valor final da venda. Isso move o lead pra Pós-venda,
// contabiliza a venda (VGV / métricas), transforma a pessoa em
// cliente, e deixa uma linha pendente em "Comissões" pro master
// preencher os percentuais depois.
export async function confirmarContratoAssinado(
  id: string,
  valorVenda: number
) {
  const agora = new Date().toISOString();

  const { data: oportunidade, error } = await supabase
    .from("oportunidades")
    .update({
      etapa: "Pós-venda",
      valor_venda: valorVenda,
      venda_fechada_em: agora,
      atualizado_em: agora,
    })
    .eq("id", id)
    .select("pessoa_id, corretor_id")
    .single();

  if (error) throw error;

  if (oportunidade?.pessoa_id) {
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

  // Cria a linha de comissão pendente (se ainda não existir) — o
  // master preenche os percentuais depois, em Financeiro > Comissões.
  const { data: comissaoExistente } = await supabase
    .from("comissoes")
    .select("id")
    .eq("oportunidade_id", id)
    .maybeSingle();

  if (!comissaoExistente) {
    await supabase.from("comissoes").insert({
      oportunidade_id: id,
      corretor_id: oportunidade?.corretor_id ?? null,
      valor_venda: valorVenda,
      status: "a_definir",
    });
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
  temperatura: string;
  problema: string;
  corretor_id: string;
}

export async function criarLead(form: NovoLeadInput) {
  // Gera o id da pessoa aqui no navegador em vez de deixar o banco
  // gerar e devolver (.select().single() depois do insert). O motivo:
  // a política de leitura de "pessoas" só libera ver um registro se
  // já existir uma oportunidade ligando ele a um corretor — mas essa
  // oportunidade só é criada duas etapas depois, aqui embaixo. Pedir
  // o "id" de volta nesse meio-tempo esbarra nessa trava (RLS) e
  // quebra a criação do lead pra qualquer login de corretor. Gerando
  // o id antes, não precisamos ler o registro de volta pra nada.
  const pessoaId = crypto.randomUUID();

  const { error: erroPessoa } = await supabase.from("pessoas").insert({
    id: pessoaId,
    nome: form.nome,
    email: form.email || null,
    telefone: form.telefone || null,
    whatsapp: form.whatsapp || form.telefone || null,
    ativo: true,
  });

  if (erroPessoa) {
    throw erroPessoa;
  }

  const { error: erroPapel } = await supabase
    .from("pessoa_papeis")
    .insert({ pessoa_id: pessoaId, papel: "lead" });

  if (erroPapel) throw erroPapel;

  const { error: erroOportunidade } = await supabase
    .from("oportunidades")
    .insert({
      pessoa_id: pessoaId,
      titulo: form.titulo || `Lead — ${form.nome}`,
      etapa: "Novo Lead",
      prioridade: form.prioridade || "Normal",
      temperatura: form.temperatura || "Morno",
      valor_interesse: form.valor_interesse
        ? Number(form.valor_interesse)
        : null,
      observacoes: form.problema || null,
      corretor_id: form.corretor_id || null,
    });

  if (erroOportunidade) throw traduzirErroPermissao(erroOportunidade);

  await notificarNovoLead({
    nome: form.nome,
    origem: "Cadastro manual no CRM",
    telefone: form.telefone,
    observacoes: form.problema,
  });
  await notificarNovoLeadPush({ nome: form.nome });

  if (form.corretor_id) {
    await notificarCorretorSobreLead(form.corretor_id, {
      nomeLead: form.nome,
      titulo: form.titulo || `Lead — ${form.nome}`,
    });
    await notificarCorretorSobreLeadPush(form.corretor_id, {
      nomeLead: form.nome,
    });
  }
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
  temperatura: string;
  problema: string;
  corretor_id: string;
}

export async function atualizarLead(
  oportunidadeId: string,
  form: EditarLeadInput
) {
  // Pega o corretor atual ANTES de atualizar, pra saber se mudou
  const { data: oportunidadeAtual } = await supabase
    .from("oportunidades")
    .select("corretor_id")
    .eq("id", oportunidadeId)
    .single();

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
      temperatura: form.temperatura,
      valor_interesse: form.valor_interesse
        ? Number(form.valor_interesse)
        : null,
      observacoes: form.problema || null,
      corretor_id: form.corretor_id || null,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", oportunidadeId);

  if (erroOportunidade) throw traduzirErroPermissao(erroOportunidade);

  // Se o corretor mudou (foi atribuído ou transferido pra outro),
  // avisa o corretor novo por e-mail
  const corretorMudou =
    form.corretor_id && form.corretor_id !== oportunidadeAtual?.corretor_id;

  if (corretorMudou) {
    await notificarCorretorSobreLead(form.corretor_id, {
      nomeLead: form.nome,
      titulo: form.titulo,
    });
    await notificarCorretorSobreLeadPush(form.corretor_id, {
      nomeLead: form.nome,
    });
  }
}

export async function excluirOportunidade(id: string) {
  // Não apaga de verdade — só marca como "perdido", pra poder usar
  // essa base depois (ex: remarketing) e não perder o histórico
  const { error } = await supabase
    .from("oportunidades")
    .update({ perdido: true, perdido_em: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function listarLeadsPerdidos(): Promise<Oportunidade[]> {
  const { data: oportunidades, error } = await supabase
    .from("oportunidades")
    .select("*")
    .eq("perdido", true)
    .order("perdido_em", { ascending: false });

  if (error) throw error;
  if (!oportunidades || oportunidades.length === 0) return [];

  const pessoaIds = [
    ...new Set(oportunidades.map((o: any) => o.pessoa_id).filter(Boolean)),
  ];

  const { data: pessoas } = await supabase
    .from("pessoas")
    .select("id, nome, telefone, whatsapp, email")
    .in("id", pessoaIds);

  const pessoaPorId = new Map((pessoas ?? []).map((p: any) => [p.id, p]));

  return oportunidades.map((o: any) => ({
    ...o,
    pessoa: pessoaPorId.get(o.pessoa_id) ?? null,
  })) as Oportunidade[];
}

export async function reativarLead(id: string) {
  const { error } = await supabase
    .from("oportunidades")
    .update({ perdido: false, perdido_em: null, etapa: "Novo Lead" })
    .eq("id", id);

  if (error) throw error;
}

export async function excluirDefinitivamente(id: string) {
  const { error } = await supabase
    .from("oportunidades")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
