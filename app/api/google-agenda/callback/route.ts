import { NextRequest, NextResponse } from "next/server";
import { trocarCodigoPorTokens } from "@/features/agenda/services/googleCalendarApi";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const corretorId = request.nextUrl.searchParams.get("state");

  if (!code || !corretorId) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/agenda?google=erro`
    );
  }

  try {
    const redirectUri = `${request.nextUrl.origin}/api/google-agenda/callback`;
    const tokens = await trocarCodigoPorTokens(code, redirectUri);

    // Descobre o e-mail da conta Google conectada
    const perfilResposta = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const perfil = await perfilResposta.json();

    const tokenExpiraEm = new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString();

    await supabaseAdmin.from("google_agenda_conexoes").upsert(
      {
        corretor_id: corretorId,
        google_email: perfil.email ?? null,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expira_em: tokenExpiraEm,
      },
      { onConflict: "corretor_id" }
    );

    return NextResponse.redirect(
      `${request.nextUrl.origin}/agenda?google=conectado`
    );
  } catch (error) {
    console.error("Erro no callback do Google Agenda:", error);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/agenda?google=erro`
    );
  }
}
