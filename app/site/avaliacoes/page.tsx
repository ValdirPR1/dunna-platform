export const revalidate = 21600;

import type { Metadata } from "next";
import { obterAvaliacoesGoogle } from "@/features/avaliacoes/services/avaliacoes.service";
import AvaliacoesConteudo from "@/features/avaliacoes/components/AvaliacoesConteudo";

export const metadata: Metadata = {
  title: "Avaliações | Dunna Imob",
  description:
    "Veja o que os clientes da Dunna Imob dizem sobre a experiência de comprar, vender ou investir em imóveis de praia com a gente.",
  alternates: {
    canonical: "/site/avaliacoes",
  },
};

export default async function AvaliacoesPage() {
  const dados = await obterAvaliacoesGoogle();

  return <AvaliacoesConteudo dados={dados} />;
}
