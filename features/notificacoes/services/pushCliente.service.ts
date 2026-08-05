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

export interface DiagnosticoPush {
  temServiceWorker: boolean;
  temPushManager: boolean;
  temNotification: boolean;
  ehStandalone: boolean;
  ehStandaloneSafari: boolean;
  ehIOS: boolean;
  versaoIOS: string | null;
}

// Diagnóstico mais fino do que "pushEstaDisponivel()" — em vez de só
// dizer "não suportado", diz QUAL pedacinho está faltando. Isso
// importa muito no iOS: a PushManager só existe quando o app foi
// aberto pelo ícone da tela de início (modo "standalone"), não numa
// aba do Safari — mesmo que o usuário já tenha feito "Adicionar à
// Tela de Início" antes. Se a pessoa jurar que já fez isso e mesmo
// assim aparecer "não suportado", esse diagnóstico ajuda a saber se
// o problema é "ainda tá no Safari" ou "iOS desatualizado".
export function diagnosticarPush(): DiagnosticoPush {
  if (typeof window === "undefined") {
    return {
      temServiceWorker: false,
      temPushManager: false,
      temNotification: false,
      ehStandalone: false,
      ehStandaloneSafari: false,
      ehIOS: false,
      versaoIOS: null,
    };
  }

  const ehIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  // "navigator.standalone" só existe quando o ícone foi adicionado
  // pelo Safari de verdade — é a bandeira específica da Apple pra
  // isso. Já "matchMedia(display-mode: standalone)" também fica
  // true quando o ícone foi salvo de dentro do navegador embutido de
  // outro app (WhatsApp, Instagram, Gmail, etc.), mas nesse caso o
  // iOS NÃO libera a PushManager, mesmo em iOS novíssimo — é o motivo
  // mais comum de "app diz que tá instalado, mas iOS está
  // desatualizado" aparecer mesmo com o aparelho 100% atualizado.
  const ehStandaloneSafari =
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  const ehStandalone =
    ehStandaloneSafari || window.matchMedia("(display-mode: standalone)").matches;

  // O Safari relata a versão do iOS no user agent no formato
  // "OS 16_4" — extrai isso pra mostrar pro usuário a versão exata
  // detectada, em vez de só dizer "está desatualizado" no escuro.
  // Isso importa porque em aparelhos mais antigos (iPhone 7, SE 1ª
  // geração, etc.) o "Atualização de Software" pode dizer que já
  // está na versão mais nova possível, mesmo sendo bem anterior à
  // 16.4 exigida pelas notificações — nesse caso o problema é o
  // aparelho ser antigo demais, não falta de atualizar.
  const versaoMatch = navigator.userAgent.match(/OS (\d+)_(\d+)(?:_(\d+))?/);
  const versaoIOS = versaoMatch
    ? `${versaoMatch[1]}.${versaoMatch[2]}${versaoMatch[3] ? `.${versaoMatch[3]}` : ""}`
    : null;

  return {
    temServiceWorker: "serviceWorker" in navigator,
    temPushManager: "PushManager" in window,
    temNotification: "Notification" in window,
    ehStandalone,
    ehStandaloneSafari,
    ehIOS,
    versaoIOS,
  };
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
