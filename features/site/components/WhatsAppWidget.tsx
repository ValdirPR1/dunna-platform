"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { criarLeadSite } from "../services/leads.service";

const NUMERO_WHATSAPP = "5581999999999";

export default function WhatsAppWidget() {
  const [balaoVisivel, setBalaoVisivel] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const tempo = setTimeout(() => setBalaoVisivel(true), 2500);
    return () => clearTimeout(tempo);
  }, []);

  function abrirForm() {
    setFormAberto(true);
    setBalaoVisivel(false);
  }

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !whatsapp) {
      toast.error("Preencha pelo menos nome e WhatsApp.");
      return;
    }

    setEnviando(true);

    try {
      await criarLeadSite({
        nome,
        email,
        telefone: whatsapp,
        mensagem: "Contato iniciado pelo balão do WhatsApp",
        origem: "balao-whatsapp",
      });

      const mensagem = encodeURIComponent(
        `Olá! Meu nome é ${nome} e gostaria de falar com um especialista da Dunna.`
      );

      window.open(
        `https://wa.me/${NUMERO_WHATSAPP}?text=${mensagem}`,
        "_blank"
      );

      setFormAberto(false);
      setNome("");
      setEmail("");
      setWhatsapp("");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">

      {/* Balão de saudação */}

      {balaoVisivel && !formAberto && (
        <div className="mb-3 w-64 rounded-2xl rounded-bl-sm bg-white p-4 shadow-xl">

          <button
            onClick={() => setBalaoVisivel(false)}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300"
            aria-label="Fechar"
          >
            <X size={12} />
          </button>

          <p className="font-sans text-sm text-navy">
            👋 Olá! Precisa de ajuda para encontrar seu imóvel?
          </p>

          <button
            onClick={abrirForm}
            className="mt-3 w-full rounded-xl bg-[#25D366] py-2 font-sans text-sm font-semibold text-white transition hover:brightness-105"
          >
            Falar agora
          </button>

        </div>
      )}

      {/* Formulário rápido */}

      {formAberto && (
        <div className="mb-3 w-72 rounded-2xl rounded-bl-sm bg-white p-5 shadow-xl">

          <div className="flex items-center justify-between">

            <p className="font-sans font-semibold text-navy">
              Fale com a gente
            </p>

            <button
              onClick={() => setFormAberto(false)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>

          </div>

          <p className="mt-1 font-sans text-sm text-slate-500">
            Preenche rapidinho pra conversar com nossa assistente virtual.
          </p>

          <form onSubmit={handleEnviar} className="mt-4 space-y-3">

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-xl border border-slate-200 p-3 font-sans text-sm outline-none focus:border-gold"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="E-mail (opcional)"
              className="w-full rounded-xl border border-slate-200 p-3 font-sans text-sm outline-none focus:border-gold"
            />

            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp"
              className="w-full rounded-xl border border-slate-200 p-3 font-sans text-sm outline-none focus:border-gold"
            />

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-xl bg-[#25D366] py-3 font-sans text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Continuar no WhatsApp"}
            </button>

          </form>

        </div>
      )}

      {/* Bolha flutuante */}

      <button
        onClick={() => (formAberto ? setFormAberto(false) : abrirForm())}
        className="flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-[#25D366] shadow-xl transition hover:brightness-105"
        aria-label="Falar no WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.82.48 3.53 1.317 5.005L2 22l5.11-1.29A9.947 9.947 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18.14a8.106 8.106 0 0 1-4.13-1.128l-.296-.176-3.03.765.81-2.955-.193-.304A8.106 8.106 0 0 1 3.86 12c0-4.494 3.647-8.14 8.14-8.14 4.494 0 8.14 3.646 8.14 8.14 0 4.493-3.646 8.14-8.14 8.14Z" />
        </svg>
      </button>

    </div>
  );
}
