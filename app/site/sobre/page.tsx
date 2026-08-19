import type { Metadata } from "next";
import SobreConteudo from "@/features/site/components/SobreConteudo";

export const metadata: Metadata = {
  title: "Sobre a Dunna | Especialistas em imóveis de praia",
  description:
    "Há mais de 10 anos conectamos pessoas aos melhores empreendimentos e imóveis do litoral pernambucano: Porto de Galinhas, Muro Alto, Praia dos Carneiros, Tamandaré e São Miguel dos Milagres.",
  alternates: {
    canonical: "/site/sobre",
  },
};

export default function SobrePage() {
  return <SobreConteudo />;
}
