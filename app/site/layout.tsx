import { ReactNode } from "react";

import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppWidget from "@/features/site/components/WhatsAppWidget";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

      <WhatsAppWidget />
    </>
  );
}