"use client";

import { useEffect } from "react";

// Registra o service worker assim que o app carrega no navegador.
// É esse registro que faz o Chrome/Android considerar o site "instalável"
// (mostra o botão de instalar / adicionar à tela de início automaticamente).
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Não foi possível registrar o service worker:", error);
    });
  }, []);

  return null;
}
