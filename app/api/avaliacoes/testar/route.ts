import { NextResponse } from "next/server";
import { obterAvaliacoesGoogle } from "@/features/avaliacoes/services/avaliacoes.service";

// Roda a mesma busca que a página pública de Avaliações faz, mas
// devolve o motivo real de qualquer falha (a página pública não
// mostra isso pro visitante, só um estado vazio genérico) — serve
// pra diagnosticar em Configurações → Integrações sem precisar sair
// da plataforma pra testar a chave/Place ID manualmente.
export async function GET() {
  const resultado = await obterAvaliacoesGoogle();
  return NextResponse.json(resultado);
}
