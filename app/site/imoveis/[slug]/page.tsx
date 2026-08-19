// Antes essa página nunca guardava cache (revalidate = 0): toda
// visita recalculava tudo do zero, consultando o banco antes de
// mostrar qualquer coisa na tela — isso é o principal motivo do
// carregamento lento no celular (LCP de ~5,5s no teste do PageSpeed
// Insights). Com cache de 2 minutos, o conteúdo continua atualizado
// rapidinho depois de qualquer alteração no CRM, mas a maioria das
// visitas recebe a página já pronta, sem esperar o banco.
export const revalidate = 120;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getImovelBySlug,
  getImagensImovel,
  getCorretorImovel,
  getImoveisSemelhantes,
} from "@/features/site/services/imoveis.service";
import { obterCotacoes } from "@/features/site/services/cambio.service";
import { SITE_URL } from "@/lib/siteUrl";
import RegistrarVisualizacaoImovel from "@/features/site/components/RegistrarVisualizacaoImovel";
import ImovelDetalhesConteudo from "@/features/site/components/ImovelDetalhesConteudo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    return { title: "Imóvel não encontrado | Dunna Imob" };
  }

  const local = imovel.bairro || imovel.cidade || "";
  const titulo = `${imovel.titulo}${local ? ` em ${local}` : ""} | Dunna Imob`;
  const descricao =
    imovel.descricao?.slice(0, 155) ??
    `${imovel.titulo}. Confira fotos, valores e detalhes deste imóvel${local ? ` em ${local}` : ""}.`;

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical: `/site/imoveis/${imovel.slug}`,
    },
    openGraph: {
      title: titulo,
      description: descricao,
      url: `/site/imoveis/${imovel.slug}`,
      type: "website",
      images: imovel.foto_capa ? [{ url: imovel.foto_capa }] : undefined,
    },
  };
}

export default async function ImovelPage({ params }: PageProps) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    notFound();
  }

  const imagensExtras = await getImagensImovel(imovel.id);

  const imagens = [
    imovel.foto_capa,
    ...imagensExtras.map((img) => img.url),
  ].filter((url): url is string => Boolean(url));

  const corretor = imovel.corretor_id
    ? await getCorretorImovel(imovel.corretor_id)
    : null;

  const imoveisSemelhantes = await getImoveisSemelhantes(imovel);

  // Cotação USD/EUR pra mostrar o valor aproximado em dólar e euro
  // (útil pra quem tá comprando de fora do Brasil) — se a API de
  // câmbio falhar, obterCotacoes() devolve null e o card do imóvel
  // simplesmente não mostra essa linha, sem quebrar a página.
  const cotacoes = await obterCotacoes();

  const produtoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: imovel.titulo,
    description: imovel.descricao ?? undefined,
    image: imagens.length > 0 ? imagens : undefined,
    offers: {
      "@type": "Offer",
      price: imovel.preco,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/site/imoveis/${imovel.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(produtoJsonLd) }}
      />

      <RegistrarVisualizacaoImovel imovelId={imovel.id} />

      <ImovelDetalhesConteudo
        imovel={imovel}
        imagens={imagens}
        corretor={corretor}
        imoveisSemelhantes={imoveisSemelhantes}
        cotacoes={cotacoes}
      />
    </>
  );
}
