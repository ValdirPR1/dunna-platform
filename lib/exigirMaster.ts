import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Confere se quem está chamando essa rota de API é um usuário logado
 * com papel "master". Sem isso, qualquer rota que usa o
 * supabaseAdmin (chave service_role, que ignora RLS) fica acessível
 * pra qualquer pessoa que souber a URL — inclusive um corretor
 * chamando a API direto pelo navegador, sem passar pela tela.
 *
 * Uso dentro de uma Route Handler:
 *   const verificacao = await exigirMaster(request);
 *   if (!verificacao.ok) return verificacao.resposta;
 */
export async function exigirMaster(request: Request): Promise<
  | { ok: true; usuarioId: string }
  | { ok: false; resposta: Response }
> {
  const cabecalho = request.headers.get("authorization") ?? "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;

  if (!token) {
    return {
      ok: false,
      resposta: Response.json({ error: "Não autenticado." }, { status: 401 }),
    };
  }

  const { data: sessao, error: erroSessao } =
    await supabaseAdmin.auth.getUser(token);

  if (erroSessao || !sessao.user) {
    return {
      ok: false,
      resposta: Response.json({ error: "Sessão inválida." }, { status: 401 }),
    };
  }

  const { data: usuario } = await supabaseAdmin
    .from("usuarios")
    .select("papel")
    .eq("id", sessao.user.id)
    .maybeSingle();

  if (!usuario || usuario.papel !== "master") {
    return {
      ok: false,
      resposta: Response.json(
        { error: "Apenas usuários master podem fazer isso." },
        { status: 403 }
      ),
    };
  }

  return { ok: true, usuarioId: sessao.user.id };
}
