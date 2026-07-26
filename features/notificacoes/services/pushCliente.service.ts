import { supabase } from "@/lib/supabase";

// Converte a chave pública VAPID (formato base64url) pro formato que
// a PushManager do navegador espera (Uint8Array)
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function pushEstaDisponivel() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function statusPermissaoPush(): NotificationPermission | "indisponivel" {
  if (!pushEstaDisponivel()) return "indisponivel";
  return Notification.permission;
}

export async function dispositivoJaInscrito(): Promise<boolean> {
  if (!pushEstaDisponivel()) return false;

  const registration = await navigator.serviceWorker.ready;
  const assinatura = await registration.pushManager.getSubscription();
  return assinatura !== null;
}

// Pede permissão (se ainda não pediu) e inscreve este dispositivo/navegador
// pra receber notificações, salvando a assinatura vinculada ao usuário logado
export async function ativarNotificacoesPush(
  usuarioId: string
): Promise<{ ok: boolean; motivo?: string }> {
  if (!pushEstaDisponivel()) {
    return { ok: false, motivo: "indisponivel" };
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    return { ok: false, motivo: "sem_chave_vapid" };
  }

  const permissao = await Notification.requestPermission();
  if (permissao !== "granted") {
    return { ok: false, motivo: "permissao_negada" };
  }

  const registration = await navigator.serviceWorker.ready;

  let assinatura = await registration.pushManager.getSubscription();
  if (!assinatura) {
    assinatura = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  }

  const dados = assinatura.toJSON();

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      usuario_id: usuarioId,
      endpoint: dados.endpoint,
      p256dh: dados.keys?.p256dh,
      auth: dados.keys?.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    console.error("Erro ao salvar assinatura de push:", error);
    return { ok: false, motivo: "erro_ao_salvar" };
  }

  return { ok: true };
}

// Desativa as notificações neste dispositivo (cancela no navegador e
// apaga a assinatura salva)
export async function desativarNotificacoesPush(): Promise<void> {
  if (!pushEstaDisponivel()) return;

  const registration = await navigator.serviceWorker.ready;
  const assinatura = await registration.pushManager.getSubscription();

  if (assinatura) {
    const endpoint = assinatura.endpoint;
    await assinatura.unsubscribe();
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  }
}
