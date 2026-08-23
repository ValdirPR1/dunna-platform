// Todas as funções aqui rodam no SERVIDOR (dentro de rotas /api),
// nunca no navegador — porque usam o Client Secret do Google, que não
// pode ser exposto.

import { supabaseAdmin } from "@/lib/supabase-admin";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export function montarUrlAutorizacao(
  corretorId: string,
  redirectUri: string,
  returnTo: string = "/agenda"
) {
  // "state" carrega o id do corretor e a página pra onde voltar depois
  // do consentimento — assim o botão de conectar funciona tanto na
  // Agenda quanto em Configurações ou na tela de Corretores, sempre
  // devolvendo a pessoa pro lugar de onde ela clicou.
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.events email",
    access_type: "offline",
    prompt: "consent",
    state: `${corretorId}|${returnTo}`,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function trocarCodigoPorTokens(
  code: string,
  redirectUri: string
) {
  const resposta = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível trocar o código pelos tokens do Google.");
  }

  return resposta.json();
}

async function renovarAccessToken(refreshToken: string) {
  const resposta = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível renovar o acesso à Google Agenda.");
  }

  return resposta.json();
}

// Resultado de qualquer operação contra a API do Google — em vez de
// devolver null/void e esconder o motivo, sempre volta com "ok" e,
// quando falha, o texto de erro que o Google devolveu (aparece nos
// logs da função na Vercel e também pode ser mostrado pro corretor).
export type ResultadoGoogle = { ok: true } | { ok: false; erro: string };
export type ResultadoGoogleComDados<T> =
  | { ok: true; dados: T }
  | { ok: false; erro: string };

async function lerErroResposta(resposta: Response): Promise<string> {
  try {
    const texto = await resposta.text();
    const json = JSON.parse(texto);
    return (
      json?.error?.message ??
      json?.error_description ??
      json?.error ??
      texto ??
      `Erro ${resposta.status}`
    );
  } catch {
    return `Erro ${resposta.status} (${resposta.statusText})`;
  }
}

// Busca (e renova se preciso) o access_token válido de um corretor
async function obterAccessTokenValido(
  corretorId: string
): Promise<ResultadoGoogleComDados<string>> {
  const { data: conexao } = await supabaseAdmin
    .from("google_agenda_conexoes")
    .select("*")
    .eq("corretor_id", corretorId)
    .single();

  if (!conexao) {
    return { ok: false, erro: "Corretor não tem a Google Agenda conectada." };
  }

  const expirado =
    !conexao.token_expira_em ||
    new Date(conexao.token_expira_em).getTime() < Date.now() + 60_000;

  if (!expirado) {
    return { ok: true, dados: conexao.access_token as string };
  }

  try {
    const tokens = await renovarAccessToken(conexao.refresh_token);

    const novaExpiracao = new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString();

    await supabaseAdmin
      .from("google_agenda_conexoes")
      .update({
        access_token: tokens.access_token,
        token_expira_em: novaExpiracao,
      })
      .eq("corretor_id", corretorId);

    return { ok: true, dados: tokens.access_token as string };
  } catch (error) {
    // Motivo mais comum aqui: o corretor revogou o acesso da Dunna
    // Platform lá no Google (em myaccount.google.com/permissions), ou
    // desconectou a conta — o refresh_token para de funcionar e só
    // reconectando de novo resolve.
    console.error(
      `Falha ao renovar token do Google (corretor ${corretorId}):`,
      error
    );
    return {
      ok: false,
      erro:
        "Não foi possível renovar o acesso à conta do Google — provavelmente o acesso foi revogado. É preciso reconectar em Configurações.",
    };
  }
}

interface DadosEvento {
  titulo: string;
  descricao?: string;
  dataHoraInicio: string; // ISO
}

export async function criarEventoNoGoogle(
  corretorId: string,
  evento: DadosEvento
): Promise<ResultadoGoogleComDados<string>> {
  const token = await obterAccessTokenValido(corretorId);
  if (!token.ok) return token;

  const inicio = new Date(evento.dataHoraInicio);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000); // 1h de duração

  const resposta = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.dados}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: evento.titulo,
        description: evento.descricao ?? "",
        start: { dateTime: inicio.toISOString() },
        end: { dateTime: fim.toISOString() },
      }),
    }
  );

  if (!resposta.ok) {
    const erro = await lerErroResposta(resposta);
    console.error(
      `Falha ao criar evento no Google (corretor ${corretorId}):`,
      resposta.status,
      erro
    );
    return { ok: false, erro };
  }

  const dados = await resposta.json();
  return { ok: true, dados: dados.id as string };
}

export async function atualizarEventoNoGoogle(
  corretorId: string,
  eventId: string,
  evento: DadosEvento
): Promise<ResultadoGoogle> {
  const token = await obterAccessTokenValido(corretorId);
  if (!token.ok) return token;

  const inicio = new Date(evento.dataHoraInicio);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

  const resposta = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.dados}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: evento.titulo,
        description: evento.descricao ?? "",
        start: { dateTime: inicio.toISOString() },
        end: { dateTime: fim.toISOString() },
      }),
    }
  );

  if (!resposta.ok) {
    const erro = await lerErroResposta(resposta);
    console.error(
      `Falha ao atualizar evento no Google (corretor ${corretorId}):`,
      resposta.status,
      erro
    );
    return { ok: false, erro };
  }

  return { ok: true };
}

export async function excluirEventoNoGoogle(
  corretorId: string,
  eventId: string
): Promise<ResultadoGoogle> {
  const token = await obterAccessTokenValido(corretorId);
  if (!token.ok) return token;

  const resposta = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token.dados}` },
    }
  );

  // 410 Gone = o evento já não existe mais no Google (ex.: apagado
  // manualmente por lá) — não é uma falha real, o resultado desejado
  // (evento não existir) já está garantido.
  if (!resposta.ok && resposta.status !== 410) {
    const erro = await lerErroResposta(resposta);
    console.error(
      `Falha ao excluir evento no Google (corretor ${corretorId}):`,
      resposta.status,
      erro
    );
    return { ok: false, erro };
  }

  return { ok: true };
}
