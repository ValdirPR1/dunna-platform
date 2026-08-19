"use client";

import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function AvaliacoesLinkMobile() {
  const { t } = useIdioma();

  return (
    <Link
      href="/site/avaliacoes"
      className="mt-8 block text-center font-sans font-semibold text-gold hover:underline md:hidden"
    >
      {t.avaliacoes.verTodas}
    </Link>
  );
}
