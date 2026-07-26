// Dispara notificações push chamando a rota /api/notificacoes/push —
// roda no navegador (chamado pelas telas de Lead/CRM), então não pode
// acessar a chave privada VAPID diretamente. Sempre em paralelo ao
// aviso por e-mail, nunca no lugar dele.

async function enviarPush(destino: unknown, titulo: string, corpo: string, url?: string) {
  try {
    await fetch("/api/notificacoes/push", {
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
