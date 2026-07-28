import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { Sora, Manrope } from "next/font/google";
import PwaRegister from "@/components/app/PwaRegister";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dunna Platform",
  description:
    "Centro de Operações da Dunna — CRM, agenda, imóveis e empreendimentos.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dunna",
  },
  // Dois códigos porque existem duas propriedades no Google Search
  // Console: uma antiga (verificação em dunna-platform.vercel.app) e
  // a nova (verificação em dunnaimob.com.br, o domínio de verdade) —
  // mantém as duas pra não perder nenhuma verificação já feita.
  verification: {
    google: [
      "a7EVfbxpytb5j1Fuke_mcGMHNtSTs1XJ3dh7LiGcCpY",
      "b7KPbmJZ_n2wRLnG574nq_D_PVumi2eiI6rn4nGcw9s",
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#101828",
};

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${manrope.variable}`}>
      <body>

        <PwaRegister />

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

      </body>
    </html>
  );
}
