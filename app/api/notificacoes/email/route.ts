import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Faltam dados pra enviar o e-mail." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error(
        "RESEND_API_KEY não configurada — e-mail de notificação não enviado."
      );
      // Não quebra o fluxo do lead por causa disso — só avisa no log
      return NextResponse.json({ ok: false, motivo: "sem_api_key" });
    }

    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dunna Platform <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.error("Erro ao enviar e-mail via Resend:", erro);
      return NextResponse.json(
        { error: "Não foi possível enviar o e-mail." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro na rota de notificação por e-mail:", error);
    return NextResponse.json(
      { error: "Erro interno ao enviar notificação." },
      { status: 500 }
    );
  }
}
