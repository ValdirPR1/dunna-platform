import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { error } = await supabaseAdmin
    .from("usuarios")
    .update(body)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

// Remove o login por completo: a linha em "usuarios" e o usuário no
// Supabase Auth (sem isso, a pessoa continuaria conseguindo logar
// mesmo removida da lista, já que o Auth é um sistema separado).
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error: erroTabela } = await supabaseAdmin
    .from("usuarios")
    .delete()
    .eq("id", id);

  if (erroTabela) {
    return NextResponse.json({ error: erroTabela.message }, { status: 400 });
  }

  const { error: erroAuth } = await supabaseAdmin.auth.admin.deleteUser(id);

  // Se o usuário já não existir mais no Auth por algum motivo, não
  // trava a operação — o que importa é que o acesso já foi revogado.
  if (erroAuth && !/not.*found/i.test(erroAuth.message ?? "")) {
    return NextResponse.json({ error: erroAuth.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
