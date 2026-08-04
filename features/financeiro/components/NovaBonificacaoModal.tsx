"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { criarBonificacao } from "../services/bonificacoes.service";
import { Corretor } from "@/features/unidades/types/unidade";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  corretores: Corretor[];
  usuarioId: string;
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export default function NovaBonificacaoModal({
  open,
  onClose,
  onSaved,
  corretores,
  usuarioId,
}: Props) {
  const [corretorId, setCorretorId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataPagamento, setDataPagamento] = useState(hoje());
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open) {
      setCorretorId(corretores[0]?.id ?? "");
      setDescricao("");
      setValor("");
      setDataPagamento(hoje());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function handleSalvar() {
    const valorNumerico = Number(valor);
    if (!corretorId) {
      toast.error("Selecione o corretor.");
      return;
    }
    if (!descricao.trim()) {
      toast.error("Descreva a bonificação.");
      return;
    }
    if (!valorNumerico || valorNumerico <= 0) {
      toast.error("Informe o valor.");
      return;
    }

    setSalvando(true);
    try {
      await criarBonificacao(
        {
          corretor_id: corretorId,
          descricao,
          valor: valorNumerico,
          data_pagamento: dataPagamento,
        },
        usuarioId
      );
      toast.success("Bonificação registrada.");
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível registrar a bonificação.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">Nova bonificação</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">Corretor</label>
            <select
              value={corretorId}
              onChange={(e) => setCorretorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            >
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Prêmio corretor do mês"
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">Valor</label>
              <input
                type="number"
                min={0}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                Data do pagamento
              </label>
              <input
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
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
            {salvando ? "Salvando..." : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
