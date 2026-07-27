import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Libera o acesso ao servidor de desenvolvimento quando testado
  // pelo celular/outro dispositivo na mesma rede Wi-Fi (sem isso, o
  // Next.js bloqueia silenciosamente certas requisições internas)
  allowedDevOrigins: [
    "192.168.0.6",
    "192.168.10.85",
  ],

  // Redirecionamentos do site antigo (dunnaimob.com.br, sistema Supremo
  // CRM) pro site novo — preserva o posicionamento no Google que os
  // links antigos já tinham, em vez de virar erro 404 quando o domínio
  // for apontado pra cá.
  async redirects() {
    return [
      // Visitante que cai na raiz do domínio vai direto pro site público
      { source: "/", destination: "/site", permanent: true },

      // Páginas institucionais
      { source: "/quem-somos.php", destination: "/site/sobre", permanent: true },
      { source: "/contato.php", destination: "/site/contato", permanent: true },
      { source: "/cadastrar_imovel.php", destination: "/site/vender", permanent: true },
      { source: "/empreendimentos.php", destination: "/site/empreendimentos", permanent: true },
      { source: "/blog.php", destination: "/site/blog", permanent: true },
      { source: "/imoveis.php", destination: "/site/imoveis", permanent: true },
      // Sem página equivalente ainda — manda pro contato
      { source: "/simuladores.php", destination: "/site/contato", permanent: true },
      { source: "/politica-de-privacidade.php", destination: "/site", permanent: true },

      // Imóveis específicos que existem nos dois sistemas (mapeados
      // manualmente pelo nome do imóvel) — preserva o posicionamento
      // individual dessas páginas no Google
      { source: "/imovel/231710/waikiki-gardem-studio", destination: "/site/imoveis/edf-waikiki-garden-studio-mobiliado-1785115381696", permanent: true },
      { source: "/imovel/204887/edf-aline-duque-residence-1-quarto", destination: "/site/imoveis/edf-aline-duque-apartamento-1-quarto-1785117846170", permanent: true },
      { source: "/imovel/212365/edf-reserva-do-porto-1-quarto", destination: "/site/imoveis/edf-reserva-do-porto-apartamento-1-quarto-1785118437364", permanent: true },
      { source: "/imovel/215005/edf-reserva-do-porto-1-quarto", destination: "/site/imoveis/edf-reserva-do-porto-apartamento-1-quarto-1785118437364", permanent: true },
      { source: "/imovel/207316/beach-class-wave-studio", destination: "/site/imoveis/beach-class-wave-apartamento-2-quartos-1784998692466", permanent: true },
      { source: "/imovel/208626/edf-dimar-residence-1-quarto", destination: "/site/imoveis/edf-dimare-residence-apartamento-1-quarto-1785119037595", permanent: true },
      { source: "/imovel/208636/edf-dimar-residence-1quarto-trreo", destination: "/site/imoveis/edf-dimare-residence-apartamento-1-quarto-terreo-1785119429698", permanent: true },
      { source: "/imovel/214952/edf-bossa-2-quartos-trreo", destination: "/site/imoveis/edf-bossa-2-quartos-1785156050123", permanent: true },
      { source: "/imovel/214951/edf-bossa-2-quartos", destination: "/site/imoveis/edf-bossa-2-quartos-1785156050123", permanent: true },
      { source: "/imovel/214282/cupe-beach-living-2-quartos", destination: "/site/imoveis/cupe-beach-living-2-quartos-1785157921521", permanent: true },
      { source: "/imovel/231496/priv-oasis-3-quartos-2-sutes", destination: "/site/imoveis/prive-oasis-apartamento-3-quartos-1784345199214", permanent: true },
      { source: "/imovel/207323/beach-class-wave-2-quartos", destination: "/site/imoveis/beach-class-wave-apartamento-2-quartos-1784999715426", permanent: true },
      { source: "/imovel/214995/amura-carneiros-3-sutes", destination: "/site/imoveis/amura-carneiros-3-suites-1785158837973", permanent: true },

      // Qualquer outro imóvel/empreendimento antigo que não tenha
      // correspondência exata no sistema novo (ainda não recadastrado,
      // ou já vendido) — manda pra listagem geral em vez de dar 404
      { source: "/imovel/:path*", destination: "/site/imoveis", permanent: true },
      { source: "/empreendimento/:path*", destination: "/site/empreendimentos", permanent: true },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clzlssjyhgiiiyjcrvtk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
