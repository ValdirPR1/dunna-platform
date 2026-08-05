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

// Busca (e renova se preciso) o access_token válido de um corretor
async function obterAccessTokenValido(corretorId: string) {
  const { data: conexao } = await supabaseAdmin
    .from("google_agenda_conexoes")
    .select("*")
    .eq("corretor_id", corretorId)
    .single();

  if (!conexao) return null;

  const expirado =
    !conexao.token_expira_em ||
    new Date(conexao.token_expira_em).getTime() < Date.now() + 60_000;

  if (!expirado) {
    return conexao.access_token as string;
  }

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

  return tokens.access_token as string;
}

interface DadosEvento {
  titulo: string;
  descricao?: string;
  dataHoraInicio: string; // ISO
}

export async function criarEventoNoGoogle(
  corretorId: string,
  evento: DadosEvento
): Promise<string | null> {
  const accessToken = await obterAccessTokenValido(corretorId);
  if (!accessToken) return null;

  const inicio = new Date(evento.dataHoraInicio);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000); // 1h de duração

  const resposta = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  if (!resposta.ok) return null;

  const dados = await resposta.json();
  return dados.id as string;
}

export async function atualizarEventoNoGoogle(
  corretorId: string,
  eventId: string,
  evento: DadosEvento
): Promise<void> {
  const accessToken = await obterAccessTokenValido(corretorId);
  if (!accessToken) return;

  const inicio = new Date(evento.dataHoraInicio);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

  await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
}

export async function excluirEventoNoGoogle(
  corretorId: string,
  eventId: string
): Promise<void> {
  const accessToken = await obterAccessTokenValido(corretorId);
  if (!accessToken) return;

  await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}
