"use client";

import { useEffect } from "react";

// Dispara, uma vez por visita real (client-side), o registro de
// visualização do imóvel — não faz parte da renderização da página
// porque a página do imóvel agora é cacheada (ISR) pra carregar mais
// rápido. Não renderiza nada na tela.
export default function RegistrarVisualizacaoImovel({
  imovelId,
}: {
  imovelId: string;
}) {
  useEffect(() => {
    fetch("/api/track/visualizacao-imovel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imovelId }),
    }).catch(() => {});
  }, [imovelId]);

  return null;
}
