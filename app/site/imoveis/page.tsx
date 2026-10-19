import type { Metadata } from "next";
import ImoveisComFiltros from "@/features/site/components/ImoveisComFiltros";
import { getImoveis } from "@/features/site/services/imoveis.service";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Imóveis à venda em Porto de Galinhas e região | Dunna Imob",
  description:
    "Apartamentos, casas e coberturas à venda em Porto de Galinhas, Muro Alto, Praia dos Carneiros, Tamandaré e São Miguel dos Milagres. Encontre o imóvel ideal para morar, investir ou rentabilizar.",
  alternates: {
    canonical: "/site/imoveis",
  },
};

interface PageProps {
  searchParams: Promise<{
    regiao?: string;
    tipo?: string;
    quartos?: string;
    valor?: string;
  }>;
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const inicial = await searchParams;
  const imoveis = await getImoveis();

  return <ImoveisComFiltros imoveis={imoveis} inicial={inicial} />;
}
