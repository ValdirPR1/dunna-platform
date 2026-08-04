"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, X } from "lucide-react";
import { Oportunidade } from "../types/oportunidade";
import { confirmarContratoAssinado } from "../services/oportunidades.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirmado: () => void;
  oportunidade: Oportunidade | null;
}

export default function ConfirmarVendaModal({
  open,
  onClose,
  onConfirmado,
  oportunidade,
}: Props) {
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open && oportunidade) {
      const sugestao = oportunidade.valor_previsto ?? oportunidade.valor_interesse ?? 0;
      setValor(sugestao ? String(sugestao) : "");
    }
  }, [open, oportunidade]);

  if (!open || !oportunidade) return null;

  async function handleConfirmar() {
    const valorNumerico = Number(valor);
    if (!valorNumerico || valorNumerico <= 0) {
      toast.error("Informe o valor final da venda.");
      return;
    }

    setSalvando(true);
    try {
      await confirmarContratoAssinado(oportunidade!.id, valorNumerico);
      toast.success("Contrato assinado! Lead movido para Pós-venda.");
      onConfirmado();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível registrar a venda.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy">
            <CheckCircle2 className="text-emerald-600" size={22} />
            Contrato assinado
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-5 font-sans text-sm text-slate-500">
          Confirme o valor final da venda de <strong>{oportunidade.titulo}</strong>.
          Esse número vira o VGV e a base da comissão.
        </p>

        <label className="mb-1 block font-sans text-sm font-medium text-navy">
          Valor da venda
        </label>
        <input
          type="number"
          min={0}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0"
          className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
          autoFocus
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-3 font-sans font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={salvando}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-sans font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {salvando ? "Confirmando..." : "Confirmar venda"}
          </button>
        </div>
      </div>
    </div>
  );
}
