"use client";

import toast from "react-hot-toast";
import { Link2, MessageCircle, Mail } from "lucide-react";

interface Props {
  titulo: string;
  path: string; // ex: "/site/imoveis/meu-imovel-123"
  variante?: "sistema" | "site";
}

export default function ShareButtons({
  titulo,
  path,
  variante = "sistema",
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

  const classeBotaoBase =
    "flex items-center gap-2 rounded-xl px-4 py-2 font-sans text-sm font-semibold transition";

  const estiloClaro =
    variante === "sistema"
      ? "border border-slate-200 text-navy hover:bg-slate-50"
      : "border border-slate-200 bg-white text-navy hover:bg-slate-50";

  return (
    <div className="flex flex-wrap items-center gap-2">

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

    </div>
  );
}
