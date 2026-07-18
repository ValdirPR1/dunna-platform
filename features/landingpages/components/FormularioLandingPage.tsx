"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { criarLeadSite } from "@/features/site/services/leads.service";

interface Props {
  empreendimentoNome: string;
  origem: string;
}

export default function FormularioLandingPage({
  empreendimentoNome,
  origem,
}: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar() {
    if (!nome || !telefone) {
      setErro("Preenche pelo menos o nome e o WhatsApp.");
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      await criarLeadSite({
        nome,
        telefone,
        email,
        mensagem: `Lead vindo de landing page: ${empreendimentoNome}`,
        origem,
      });

      setEnviado(true);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle2 className="text-emerald-500" size={44} />
        <p className="mt-4 font-sans text-lg font-semibold text-navy">
          Recebemos seus dados!
        </p>
        <p className="mt-2 font-sans text-slate-500">
          Um corretor especialista vai entrar em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Seu nome"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      <input
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        placeholder="WhatsApp (com DDD)"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="E-mail (opcional)"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      {erro && <p className="font-sans text-sm text-red-500">{erro}</p>}

      <button
        onClick={enviar}
        disabled={enviando}
        className="w-full rounded-xl bg-gold py-4 font-sans text-lg font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Quero saber mais"}
      </button>

    </div>
  );
}
