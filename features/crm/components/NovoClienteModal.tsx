"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { criarCliente } from "../services/clientes.service";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function NovoClienteModal({ open, onClose, onSaved }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [salvando, setSalvando] = useState(false);

  if (!open) return null;

  async function handleSalvar() {
    if (!nome) {
      toast.error("Preencha o nome do cliente.");
      return;
    }

    setSalvando(true);

    try {
      await criarCliente({ nome, telefone, email, whatsapp });
      toast.success("Cliente cadastrado!");
      setNome("");
      setTelefone("");
      setEmail("");
      setWhatsapp("");
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível cadastrar o cliente.");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="flex items-center justify-between">

          <h2 className="font-display text-2xl font-bold text-navy">
            Novo Cliente
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>

        </div>

        <div className="mt-6 space-y-4">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className={inputClass}
          />

          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            className={inputClass}
          />

          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="WhatsApp"
            className={inputClass}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className={inputClass}
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-3 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Criar Cliente"}
          </button>

        </div>

      </div>

    </div>
  );
}
