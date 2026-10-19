"use client";

import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function AvaliacoesLinkMobile() {
  const { t } = useIdioma();

  return (
    <Link
      href="/site/avaliacoes"
      className="rotulo-luxo mt-10 block text-center text-gold-dark hover:underline md:hidden"
    >
      {t.avaliacoes.verTodas}
    </Link>
  );
}
