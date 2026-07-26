"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { criarLeadSite } from "../services/leads.service";

const NUMERO_WHATSAPP = "5581996825134";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  mensagemWhatsapp: string;
  origem: string;
}

export default function ContatoWhatsappModal({
  aberto,
  onFechar,
  mensagemWhatsapp,
  origem,
}: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  if (!aberto) return null;

  async function enviar() {
    if (!nome || !whatsapp) {
      setErro("Preencha pelo menos nome e WhatsApp.");
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      await criarLeadSite({
        nome,
        email,
        telefone: whatsapp,
        mensagem: mensagemWhatsapp,
        origem,
      });

      const texto = encodeURIComponent(
        `Olá! Meu nome é ${nome}. ${mensagemWhatsapp}`
      );

      window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${texto}`, "_blank");

      fechar();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível enviar. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  function fechar() {
    onFechar();
    setTimeout(() => {
      setNome("");
      setEmail("");
      setWhatsapp("");
      setErro("");
    }, 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
      onClick={fechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >

        <div className="flex items-start justify-between">

          <h3 className="font-display text-xl font-bold text-navy">
            Fale com a gente
          </h3>

          <button onClick={fechar} aria-label="Fechar">
            <X size={20} className="text-slate-400 hover:text-slate-600" />
          </button>

        </div>

        <p className="mt-2 font-sans text-sm text-slate-500">
          Preenche rapidinho e te levamos direto pro WhatsApp.
        </p>

        <div className="mt-6 space-y-4">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail (opcional)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="WhatsApp (com DDD)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          {erro && <p className="font-sans text-sm text-red-500">{erro}</p>}

          <button
            onClick={enviar}
            disabled={enviando}
            className="w-full rounded-xl bg-[#25D366] py-4 font-sans font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Continuar no WhatsApp"}
          </button>

        </div>

      </div>
    </div>
  );
}
