// Cache de 2 minutos (ISR) em vez de recalcular a página do zero a
// cada visita — é o principal motivo do carregamento lento no
// celular (LCP de ~5,5s no PageSpeed Insights). Os destaques ainda
// atualizam rapidinho, só não recalculam a cada clique.
export const revalidate = 120;

import type { Metadata } from "next";
import Hero from "@/components/site/Hero";
import SearchBar from "@/components/site/SearchBar";
import Regions from "@/components/site/Regions";
import FeaturedDevelopments from "@/components/site/FeaturedDevelopments";
import UltimosArtigos from "@/components/site/UltimosArtigos";
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

        <div className="mx-auto mb-10 max-w-7xl px-6">

          <span className="font-sans font-semibold text-gold">
            IMÓVEIS EM DESTAQUE
          </span>

          <h2 className="mt-3 break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
            Oportunidades selecionadas
          </h2>

          <p className="mt-3 max-w-2xl font-sans text-lg text-slate-500">
            Imóveis escolhidos pela equipe Dunna para morar, investir
            e rentabilizar.
          </p>

        </div>

        <PropertyCarousel imoveis={destaques} />

      </div>

      <FeaturedDevelopments />

      <Regions />

      <UltimosArtigos />

      <CTA />
    </>
  );
}
