// ATENÇÃO: usa a chave privada VAPID — só pode ser importado em código
// que roda no servidor (API routes, cron), nunca em componente "use client".

import webpush from "web-push";
import { supabaseAdmin } from "./supabase-admin";

let configurado = false;

function garantirConfigurado() {
  if (configurado) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contato@dunnaimob.com.br";

  if (!publicKey || !privateKey) {
    throw new Error(
      "VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY não configuradas — notificação push não pode ser enviada."
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configurado = true;
}

export interface PayloadPush {
  titulo: string;
  corpo: string;
  url?: string;
}

// Manda a notificação pra todos os dispositivos inscritos dos usuários
// informados. Se algum dispositivo não existir mais (desinstalou o
// app, trocou de celular etc), a assinatura é apagada sozinha.
export async function enviarPushParaUsuarios(
  usuarioIds: string[],
  payload: PayloadPush
): Promise<{ enviados: number }> {
  const idsUnicos = [...new Set(usuarioIds.filter(Boolean))];
  if (idsUnicos.length === 0) return { enviados: 0 };

  try {
    garantirConfigurado();
  } catch (error) {
    console.error(error);
    return { enviados: 0 };
  }

  const { data: assinaturas, error } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .in("usuario_id", idsUnicos);

  if (error || !assinaturas || assinaturas.length === 0) {
    return { enviados: 0 };
  }

  const corpoNotificacao = JSON.stringify({
    title: payload.titulo,
    body: payload.corpo,
    url: payload.url || "/dashboard",
  });

  let enviados = 0;

  await Promise.all(
    assinaturas.map(async (assinatura) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: assinatura.endpoint,
            keys: { p256dh: assinatura.p256dh, auth: assinatura.auth },
          },
          corpoNotificacao
        );
        enviados++;
      } catch (erroEnvio: any) {
        // 404/410 = a inscrição não existe mais no navegador (desinstalou,
        // limpou dados etc) — apaga do banco pra não tentar de novo
        if (erroEnvio?.statusCode === 404 || erroEnvio?.statusCode === 410) {
          await supabaseAdmin
            .from("push_subscriptions")
            .delete()
            .eq("id", assinatura.id);
        } else {
          console.error("Erro ao enviar push:", erroEnvio);
        }
      }
    })
  );

  return { enviados };
}

// Busca os usuarios.id de todos os masters ativos
export async function idsDosMasters(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("usuarios")
    .select("id")
    .eq("papel", "master")
    .eq("ativo", true);

  return (data ?? []).map((u) => u.id);
}

// Busca o usuarios.id vinculado a um corretor específico
export async function idDoUsuarioPorCorretor(
  corretorId: string
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("usuarios")
    .select("id")
    .eq("corretor_id", corretorId)
    .maybeSingle();

  return data?.id ?? null;
}
