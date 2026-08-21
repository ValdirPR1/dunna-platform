"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// O código base do Pixel só registra a primeira visualização de
// página sozinho (o carregamento inicial). Como o site navega entre
// páginas sem recarregar (Next.js), sem isso o Meta só veria uma
// "PageView" por visita, mesmo que a pessoa veja vários imóveis — o
// que prejudica a otimização dos anúncios. Esse componente dispara
// uma PageView extra a cada troca de página.
export default function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const primeiraVez = useRef(true);

  useEffect(() => {
    // A primeira PageView já é disparada pelo próprio código base do
    // pixel, no <script> — pula essa pra não contar em dobro.
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}
