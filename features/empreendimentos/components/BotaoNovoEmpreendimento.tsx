"use client";

import Link from "next/link";
import { useAuth } from "@/features/core/auth/useAuth";

// Só master pode cadastrar empreendimento novo — corretor só
// visualiza o que já existe.
export default function BotaoNovoEmpreendimento() {
  const { usuario } = useAuth();

  if (usuario?.papel !== "master") return null;

  return (
    <Link
      href="/empreendimentos/novo"
      className="rounded-xl bg-gold px-5 py-3 text-center font-sans font-semibold text-white transition hover:bg-gold-dark"
    >
      Novo Empreendimento
    </Link>
  );
}
