// Dispara notificações push chamando a rota /api/notificacoes/push.
// É chamado tanto do navegador (telas de Lead/CRM) quanto do servidor
// (ex: webhooks recebidos em app/api/*), então não pode usar uma URL
// relativa — no servidor isso quebra silenciosamente (fetch não sabe
// resolver "/api/..." sem um navegador). Por isso monta a URL absoluta
// quando está rodando fora do navegador. Sempre em paralelo ao aviso
// por e-mail, nunca no lugar dele.

import { SITE_URL } from "@/lib/siteUrl";

async function enviarPush(destino: unknown, titulo: string, corpo: string, url?: string) {
  try {
    const base = typeof window === "undefined" ? SITE_URL : "";
    await fetch(`${base}/api/notificacoes/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destino, titulo, corpo, url }),
    });
  } catch (error) {
    // Notificação nunca deve travar o fluxo principal (criar/editar lead)
    console.error("Falha ao enviar notificação push:", error);
  }
}

// Avisa todo mundo com papel "master" sempre que um lead novo entra
export async function notificarNovoLeadPush(dados: { nome: string }) {
  await enviarPush(
    { tipo: "papel", papel: "master" },
    "🔔 Novo lead",
    dados.nome,
    "/crm/leads"
  );
}

// Avisa o corretor específico quando um lead é atribuído (ou
// transferido) pra ele
export async function notificarCorretorSobreLeadPush(
  corretorId: string,
  dados: { nomeLead: string }
) {
  await enviarPush(
    { tipo: "corretor", corretorId },
    "📋 Lead atribuído a você",
    dados.nomeLead,
    "/crm/leads"
  );
}

// Avisa o corretor que foi convidado pra um evento compartilhado
export async function notificarCorretorSobreEventoPush(
  corretorId: string,
  dados: { titulo: string }
) {
  await enviarPush(
    { tipo: "corretor", corretorId },
    "📅 Novo evento",
    dados.titulo,
    "/agenda"
  );
}
