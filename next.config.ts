import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Libera o acesso ao servidor de desenvolvimento quando testado
  // pelo celular/outro dispositivo na mesma rede Wi-Fi (sem isso, o
  // Next.js bloqueia silenciosamente certas requisições internas)
  allowedDevOrigins: [
    "192.168.0.6",
    "192.168.10.85",
  ],
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
