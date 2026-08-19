import { ReactNode } from "react";

import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppWidget from "@/features/site/components/WhatsAppWidget";
import { SITE_URL } from "@/lib/siteUrl";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";
import { IdiomaProvider } from "@/features/idioma/IdiomaContext";

// Endereço fixo do escritório (não muda com frequência, então não
// precisa vir do banco) — usado só pro dado estruturado da empresa.
const ENDERECO_ESCRITORIO = {
  streetAddress: "Estrada de Maracaípe, 357 - sala 05",
  addressLocality: "Porto de Galinhas, Ipojuca",
  postalCode: "55590-000",
};

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const config = await obterConfiguracoes().catch(() => ({}) as Record<string, string>);

  const redesSociais = [config.empresa_instagram, config.empresa_youtube].filter(
    (url): url is string => Boolean(url)
  );

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Dunna Imob",
    url: `${SITE_URL}/site`,
    image: `${SITE_URL}/logo/dunna-site.png`,
    logo: `${SITE_URL}/logo/dunna-site.png`,
    description:
      "Especialistas em imóveis de praia no litoral de Pernambuco: Porto de Galinhas, Muro Alto, Praia dos Carneiros, Tamandaré e São Miguel dos Milagres.",
    areaServed: [
      "Porto de Galinhas",
      "Muro Alto",
      "Praia dos Carneiros",
      "Tamandaré",
      "São Miguel dos Milagres",
    ].map((regiao) => ({ "@type": "Place", name: regiao })),
    address: {
      "@type": "PostalAddress",
      ...ENDERECO_ESCRITORIO,
      addressRegion: "PE",
      addressCountry: "BR",
    },
    ...(config.empresa_whatsapp
      ? { telephone: config.empresa_whatsapp }
      : {}),
    ...(redesSociais.length > 0 ? { sameAs: redesSociais } : {}),
  };

  return (
    <IdiomaProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

      <WhatsAppWidget />
    </IdiomaProvider>
  );
}