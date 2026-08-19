// Cache de 2 minutos (ISR) em vez de recalcular a página do zero a
// cada visita — é o principal motivo do carregamento lento no
// celular (LCP de ~5,5s no PageSpeed Insights). Os destaques ainda
// atualizam rapidinho, só não recalculam a cada clique.
export const revalidate = 120;

import type { Metadata } from "next";
import Hero from "@/components/site/Hero";
import SearchBar from "@/components/site/SearchBar";
import HomeIntro from "@/components/site/HomeIntro";
import Regions from "@/components/site/Regions";
import FeaturedDevelopments from "@/components/site/FeaturedDevelopments";
import UltimosArtigos from "@/components/site/UltimosArtigos";
import AvaliacoesHome from "@/components/site/AvaliacoesHome";
import CTA from "@/components/site/CTA";
import PropertyCarousel from "@/features/site/components/PropertyCarousel";
import { getFeaturedProperties } from "@/features/site/services/imoveis.service";

export const metadata: Metadata = {
  title: "Dunna Imob | Imóveis de praia em Porto de Galinhas e região",
  description:
    "Encontre apartamentos, casas e empreendimentos selecionados em Porto de Galinhas, Muro Alto, Praia dos Carneiros, Tamandaré e São Miguel dos Milagres. Especialistas em imóveis de praia no litoral de Pernambuco.",
  alternates: {
    canonical: "/site",
  },
  openGraph: {
    title: "Dunna Imob | Imóveis de praia em Porto de Galinhas e região",
    description:
      "Apartamentos, casas e empreendimentos selecionados no litoral de Pernambuco.",
    url: "/site",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function HomePage() {
  const destaques = await getFeaturedProperties();

  return (
    <>
      <Hero />

      <SearchBar />

      <div className="py-16">

        <HomeIntro />

        <PropertyCarousel imoveis={destaques} />

      </div>

      <FeaturedDevelopments />

      <Regions />

      <UltimosArtigos />

      <AvaliacoesHome />

      <CTA />
    </>
  );
}
