import type { Metadata } from "next";
import VenderConteudo from "@/features/site/components/VenderConteudo";

export const metadata: Metadata = {
  title: "Vender ou alugar seu imóvel | Dunna Imob",
  description:
    "Quer vender ou alugar seu imóvel no litoral de Pernambuco? Conte pra gente e um corretor especialista da Dunna entra em contato em até 24h úteis.",
  alternates: {
    canonical: "/site/vender",
  },
};

export default function VenderImovelPage() {
  return <VenderConteudo />;
}
