"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import CampoValorMoeda from "@/components/ui/CampoValorMoeda";
import { salvarSaldoInicialCaixa } from "../services/caixa.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  saldoAtual: number;
}

export default function SaldoInicialCaixaModal({
  open,
  onClose,
  onSaved,
  saldoAtual,
}: Props) {
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open) setValor(saldoAtual ? String(Math.round(saldoAtual)) : "");
  }, [open, saldoAtual]);

  if (!open) return null;

  async function handleSalvar() {
    setSalvando(true);
    try {
      await salvarSaldoInicialCaixa(Number(valor) || 0);
      toast.success("Saldo inicial atualizado.");
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o saldo inicial.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">
            Saldo inicial do caixa
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 font-sans text-sm text-slate-500">
          Quanto já havia em caixa antes dos lançamentos do sistema. Esse valor
          é somado a todas as entradas e saídas pra chegar no saldo em caixa.
        </p>

        <CampoValorMoeda value={valor} onChange={setValor} autoFocus />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-3 font-sans font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
