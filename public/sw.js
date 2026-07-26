// Service worker — deixa o app instalável na tela do celular e mostra
// as notificações push (novo lead, tarefa da agenda, lead parado).
// Não faz cache de nada de propósito, pra não arriscar mostrar dado
// antigo/errado do sistema.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Sem cache — deixa tudo passar direto pra rede, como se o
  // service worker não existisse na prática.
});

// Chega uma notificação push do servidor — mostra ela pro usuário
self.addEventListener("push", (event) => {
  let dados = { title: "Dunna Platform", body: "Você tem uma novidade." };

  if (event.data) {
    try {
      dados = event.data.json();
    } catch {
      dados.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(dados.title, {
      body: dados.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: dados.url || "/dashboard" },
    })
  );
});

// A pessoa tocou na notificação — abre o app na tela certa (ou só foca
// se já estiver aberto em alguma aba)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});
