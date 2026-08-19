export const revalidate = 300;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getEmpreendimentoBySlug,
  listarPlantasEmpreendimento,
} from "@/features/site/services/empreendimentos.service";
import { SITE_URL } from "@/lib/siteUrl";
import EmpreendimentoDetalhesConteudo from "@/features/site/components/EmpreendimentoDetalhesConteudo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const empreendimento = await getEmpreendimentoBySlug(slug);

  if (!empreendimento) {
    return { title: "Empreendimento não encontrado | Dunna Imob" };
  }

  const local = [empreendimento.bairro, empreendimento.cidade]
    .filter((v) => v && v !== "VAZIO")
    .join(", ");
  const titulo = `${empreendimento.nome}${local ? ` em ${local}` : ""} | Dunna Imob`;
  const descricao =
    empreendimento.descricao?.slice(0, 155) ??
    `Conheça o ${empreendimento.nome}${local ? `, em ${local}` : ""}. Fotos, plantas e informações completas.`;

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical: `/site/empreendimentos/${empreendimento.slug}`,
    },
    openGraph: {
      title: titulo,
      description: descricao,
      url: `/site/empreendimentos/${empreendimento.slug}`,
      type: "website",
      images: empreendimento.fotoCapa ? [{ url: empreendimento.fotoCapa }] : undefined,
    },
  };
}

export default async function EmpreendimentoPage({ params }: PageProps) {
  const { slug } = await params;
  const empreendimento = await getEmpreendimentoBySlug(slug);

  if (!empreendimento) {
    notFound();
  }

  const plantas = await listarPlantasEmpreendimento(empreendimento.id);

  const empreendimentoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: empreendimento.nome,
    description: empreendimento.descricao ?? undefined,
    image:
      empreendimento.fotos && empreendimento.fotos.length > 0
        ? empreendimento.fotos
        : empreendimento.fotoCapa
        ? [empreendimento.fotoCapa]
        : undefined,
    brand: {
      "@type": "Organization",
      name: "Dunna Imob",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      url: `${SITE_URL}/site/empreendimentos/${empreendimento.slug}`,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(empreendimentoJsonLd) }}
      />

      <EmpreendimentoDetalhesConteudo empreendimento={empreendimento} plantas={plantas} />
    </>
  );
}
