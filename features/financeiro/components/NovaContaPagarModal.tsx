"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { CATEGORIAS_CONTA, CategoriaConta } from "../types/admFinanceiro";
import { criarContaPagar } from "../services/contasPagar.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  usuarioId: string;
}

const FORM_VAZIO = {
  categoria: "luz" as CategoriaConta,
  descricao: "",
  valor: "",
  vencimento: "",
  repeticoes: "1",
};

export default function NovaContaPagarModal({ open, onClose, onSaved, usuarioId }: Props) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open) setForm(FORM_VAZIO);
  }, [open]);

  if (!open) return null;

  async function handleSalvar() {
    const valorNumerico = Number(form.valor);
    if (!valorNumerico || valorNumerico <= 0) {
      toast.error("Informe o valor da conta.");
      return;
    }

    setSalvando(true);
    try {
      await criarContaPagar(
        { ...form, valor: valorNumerico, repeticoes: Number(form.repeticoes) },
        usuarioId
      );
      const repeticoes = Number(form.repeticoes);
      toast.success(
        repeticoes > 1 ? `Conta cadastrada em ${repeticoes} parcelas.` : "Conta cadastrada."
      );
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível cadastrar a conta.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">Nova conta a pagar</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">Categoria</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaConta })}
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            >
              {CATEGORIAS_CONTA.map((c) => (
                <option key={c.valor} value={c.valor}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Conta de luz - agência"
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">Valor</label>
              <input
                type="number"
                min={0}
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                {Number(form.repeticoes) > 1 ? "1º vencimento" : "Vencimento"}
              </label>
              <input
                type="date"
                value={form.vencimento}
                onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">Repete?</label>
            <select
              value={form.repeticoes}
              onChange={(e) => setForm({ ...form, repeticoes: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            >
              <option value="1">Não repete</option>
              {Array.from({ length: 11 }).map((_, i) => (
                <option key={i} value={i + 2}>
                  Repete por {i + 2}x (meses)
                </option>
              ))}
            </select>
            {Number(form.repeticoes) > 1 && (
              <p className="mt-1 font-sans text-xs text-slate-400">
                Gera {form.repeticoes} contas, uma por mês a partir do vencimento acima.
              </p>
            )}
          </div>
        </div>

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
            {salvando ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
