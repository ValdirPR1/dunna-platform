"use client";

import toast from "react-hot-toast";
import { Link2, MessageCircle, Mail, Share2 } from "lucide-react";

interface Props {
  titulo: string;
  path: string; // ex: "/site/imoveis/meu-imovel-123"
  variante?: "sistema" | "site";
  imagemUrl?: string | null; // foto de capa, usada no compartilhamento nativo (Instagram etc.)
}

export default function ShareButtons({
  titulo,
  path,
  variante = "sistema",
  imagemUrl,
}: Props) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : "";

  function handleCopiarLink() {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  function handleWhatsApp() {
    const texto = encodeURIComponent(`Olha isso: ${titulo}\n${url}`);
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  }

  function handleEmail() {
    const assunto = encodeURIComponent(titulo);
    const corpo = encodeURIComponent(`Olá! Segue o link:\n\n${url}`);
    window.open(`mailto:?subject=${assunto}&body=${corpo}`);
  }

  // Instagram não tem um link tipo "wa.me" pra abrir compartilhamento
  // direto. O jeito que funciona em qualquer celular é abrir o menu de
  // compartilhamento nativo do sistema (o mesmo que aparece em qualquer
  // app) — o Instagram aparece como uma das opções, junto com Stories.
  // Em computador esse menu não existe, então cai no fallback de copiar
  // o link.
  async function handleCompartilharNativo() {
    if (typeof navigator === "undefined" || !navigator.share) {
      navigator.clipboard.writeText(url);
      toast.success(
        "Esse botão funciona pelo celular. Copiei o link — é só colar no Instagram."
      );
      return;
    }

    const dadosCompartilhamento: ShareData = {
      title: titulo,
      text: `Olha isso: ${titulo}`,
      url,
    };

    if (imagemUrl) {
      try {
        const resposta = await fetch(imagemUrl);
        const blob = await resposta.blob();
        const arquivo = new File([blob], "imovel.jpg", {
          type: blob.type || "image/jpeg",
        });

        if (navigator.canShare?.({ files: [arquivo] })) {
          dadosCompartilhamento.files = [arquivo];
        }
      } catch {
        // Sem imagem, compartilha só o link/texto mesmo.
      }
    }

    try {
      await navigator.share(dadosCompartilhamento);
    } catch (erro: any) {
      if (erro?.name !== "AbortError") {
        toast.error("Não foi possível abrir o compartilhamento.");
      }
    }
  }

  const classeBotaoBase =
    "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-sans text-sm font-semibold transition sm:py-2 sm:text-base";

  const estiloClaro =
    variante === "sistema"
      ? "border border-slate-200 text-navy hover:bg-slate-50"
      : "border border-slate-200 bg-white text-navy hover:bg-slate-50";

  return (
    <div className={variante === "sistema" ? "contents" : "flex flex-wrap items-center gap-2"}>

      <button
        onClick={handleCopiarLink}
        className={`${classeBotaoBase} ${estiloClaro}`}
      >
        <Link2 size={16} />
        Copiar link
      </button>

      <button
        onClick={handleWhatsApp}
        className={`${classeBotaoBase} border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
      >
        <MessageCircle size={16} />
        WhatsApp
      </button>

      <button
        onClick={handleEmail}
        className={`${classeBotaoBase} ${estiloClaro}`}
      >
        <Mail size={16} />
        E-mail
      </button>

      <button
        onClick={handleCompartilharNativo}
        className={`${classeBotaoBase} border border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100`}
      >
        <Share2 size={16} />
        Instagram
      </button>

    </div>
  );
}
