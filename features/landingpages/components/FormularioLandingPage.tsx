"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { criarLeadSite } from "@/features/site/services/leads.service";

interface Props {
  empreendimentoNome: string;
  origem: string;
  tipologias?: string[];
}

export default function FormularioLandingPage({
  empreendimentoNome,
  origem,
  tipologias = [],
}: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [tipologia, setTipologia] = useState("");
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
        mensagem: `Lead vindo de landing page: ${empreendimentoNome}${
          tipologia ? ` — Tipologia de interesse: ${tipologia}` : ""
        }`,
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
        placeholder="Nome completo"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="E-mail"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      <input
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        placeholder="Telefone / WhatsApp"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      {tipologias.length > 0 && (
        <select
          value={tipologia}
          onChange={(e) => setTipologia(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        >
          <option value="">Tipologia de interesse</option>
          {tipologias.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>
      )}

      {erro && <p className="font-sans text-sm text-red-500">{erro}</p>}

      <button
        onClick={enviar}
        disabled={enviando}
        className="w-full rounded-xl bg-gold py-4 font-sans text-lg font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Quero receber a tabela"}
      </button>

      <p className="text-center font-sans text-xs text-slate-400">
        Ao enviar, você concorda em receber contato da nossa equipe comercial.
      </p>

    </div>
  );
}
