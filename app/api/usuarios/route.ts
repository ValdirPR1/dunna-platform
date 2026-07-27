import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { exigirMaster } from "@/lib/exigirMaster";

export async function GET(request: Request) {
  const verificacao = await exigirMaster(request);
  if (!verificacao.ok) return verificacao.resposta;

  const { data, error } = await supabaseAdmin
    .from("usuarios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ usuarios: data });
}

export async function POST(request: Request) {
  const verificacao = await exigirMaster(request);
  if (!verificacao.ok) return verificacao.resposta;

  const body = await request.json();
  const { nome, email, senha, papel, corretor_id } = body;

  if (!nome || !email || !senha || !papel) {
    return NextResponse.json(
      { error: "Preencha nome, e-mail, senha e papel." },
      { status: 400 }
    );
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Erro ao criar o login." },
      { status: 400 }
    );
  }

  const { error: dbError } = await supabaseAdmin.from("usuarios").insert({
    id: authData.user.id,
    nome,
    email,
    papel,
    corretor_id: corretor_id || null,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
