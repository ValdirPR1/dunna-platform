"use client";

import { useEffect, useState } from "react";
import { useIdioma } from "./IdiomaContext";

const PREFIXO_CACHE = "dunna_trad";

// Hash bem simples só pra gerar uma chave de cache curta — não precisa
// ser criptográfico, só precisa ser estável pro mesmo texto.
function hashTexto(texto: string): string {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash * 31 + texto.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

function lerCache(chave: string): string | null {
  try {
    return window.localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function salvarCache(chave: string, valor: string) {
  try {
    window.localStorage.setItem(chave, valor);
  } catch {
    // Se o localStorage estiver cheio/bloqueado, sem problema — só não
    // fica em cache, traduz de novo na próxima vez.
  }
}

// Traduz um texto (ou HTML, com `html: true`) vindo do banco quando o
// idioma escolhido não é português. Enquanto a tradução não chega (ou
// se falhar), devolve o texto original — nunca deixa a tela em
// branco. Guarda o resultado no localStorage do navegador pra não
// pedir a mesma tradução de novo.
export function useTraducaoAutomatica(
  texto: string | null | undefined,
  opcoes?: { html?: boolean }
): string {
  const { idioma } = useIdioma();
  const [traduzido, setTraduzido] = useState<string | null>(null);
  const textoOriginal = texto ?? "";
  const html = opcoes?.html ?? false;

  useEffect(() => {
    if (idioma === "pt" || !textoOriginal.trim()) {
      setTraduzido(null);
      return;
    }

    const chave = `${PREFIXO_CACHE}:${idioma}:${html ? "html" : "txt"}:${hashTexto(
      textoOriginal
    )}`;

    const emCache = lerCache(chave);
    if (emCache !== null) {
      setTraduzido(emCache);
      return;
    }

    let cancelado = false;

    fetch("/api/traduzir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: textoOriginal, idioma, html }),
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (cancelado) return;
        const resultado: string = dados?.traduzido ?? textoOriginal;
        setTraduzido(resultado);
        salvarCache(chave, resultado);
      })
      .catch(() => {
        // Falhou: fica com o texto original mesmo (setTraduzido(null) já é o padrão)
      });

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idioma, textoOriginal, html]);

  return traduzido ?? textoOriginal;
}
