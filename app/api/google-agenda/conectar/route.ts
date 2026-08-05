import { NextRequest, NextResponse } from "next/server";
import { montarUrlAutorizacao } from "@/features/agenda/services/googleCalendarApi";

export async function GET(request: NextRequest) {
  const corretorId = request.nextUrl.searchParams.get("corretor_id");

  if (!corretorId) {
    return NextResponse.json(
      { error: "corretor_id é obrigatório" },
      { status: 400 }
    );
  }

  const returnTo = request.nextUrl.searchParams.get("return_to") || "/agenda";
  const redirectUri = `${request.nextUrl.origin}/api/google-agenda/callback`;
  const url = montarUrlAutorizacao(corretorId, redirectUri, returnTo);

  return NextResponse.redirect(url);
}
