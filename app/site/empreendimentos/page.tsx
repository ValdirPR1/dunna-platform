export const revalidate = 120;

import type { Metadata } from "next";
import { getEmpreendimentos } from "@/features/site/services/empreendimentos.service";
import EmpreendimentosListaConteudo from "@/features/site/components/EmpreendimentosListaConteudo";

export const metadata: Metadata = {
  title: "Empreendimentos no litoral de Pernambuco | Dunna Imob",
  description:
    "Conheça os empreendimentos selecionados pela Dunna em Porto de Galinhas, Muro Alto, Praia dos Carneiros, Tamandaré e São Miguel dos Milagres.",
  alternates: {
    canonical: "/site/empreendimentos",
  },
};

export default async function EmpreendimentosPage() {
  const empreendimentos = await getEmpreendimentos();

  return <EmpreendimentosListaConteudo empreendimentos={empreendimentos} />;
}
