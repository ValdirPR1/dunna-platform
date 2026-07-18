import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const { corretorId } = await request.json();

  if (!corretorId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await supabaseAdmin
    .from("google_agenda_conexoes")
    .delete()
    .eq("corretor_id", corretorId);

  return NextResponse.json({ ok: true });
}
