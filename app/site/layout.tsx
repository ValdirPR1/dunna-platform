import { ReactNode } from "react";

import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppWidget from "@/features/site/components/WhatsAppWidget";
import { SITE_URL } from "@/lib/siteUrl";

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
    addressRegion: "PE",
    addressCountry: "BR",
  },
};

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
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
    </>
  );
}