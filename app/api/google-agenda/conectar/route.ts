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

  const redirectUri = `${request.nextUrl.origin}/api/google-agenda/callback`;
  const url = montarUrlAutorizacao(corretorId, redirectUri);

  return NextResponse.redirect(url);
}
