import { ReactNode, Suspense } from "react";
import Script from "next/script";

import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppWidget from "@/features/site/components/WhatsAppWidget";
import { SITE_URL } from "@/lib/siteUrl";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";
import { IdiomaProvider } from "@/features/idioma/IdiomaContext";
import MetaPixelRouteTracker from "@/features/site/components/MetaPixelRouteTracker";

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

      {config.meta_pixel_id && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${config.meta_pixel_id}');
              fbq('track', 'PageView');
            `}
          </Script>

          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              alt=""
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${config.meta_pixel_id}&ev=PageView&noscript=1`}
            />
          </noscript>

          <Suspense fallback={null}>
            <MetaPixelRouteTracker />
          </Suspense>
        </>
      )}

      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

      <WhatsAppWidget />
    </IdiomaProvider>
  );
}