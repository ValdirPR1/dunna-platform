"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { criarEvento } from "../services/eventos.service";
import { Corretor } from "@/features/unidades/types/unidade";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  corretores: Corretor[];
  criadoPor: string;
}

const FORM_VAZIO = {
  titulo: "",
  descricao: "",
  data_hora: "",
  local: "",
};

export default function NovoEventoModal({
  open,
  onClose,
  onSaved,
  corretores,
  criadoPor,
}: Props) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(FORM_VAZIO);
      setSelecionados([]);
    }
  }, [open]);

  if (!open) return null;

  function alternarCorretor(id: string) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSalvar() {
    if (!form.titulo.trim() || !form.data_hora) {
      toast.error("Preencha ao menos o título e a data/hora.");
      return;
    }
    if (selecionados.length === 0) {
      toast.error("Selecione ao menos um corretor pra convidar.");
      return;
    }

    setSalvando(true);
    try {
      await criarEvento(
        { ...form, corretorIds: selecionados },
        criadoPor
      );
      toast.success("Evento criado e corretores avisados.");
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível criar o evento.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">
            Novo evento
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">
              Título
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ex: Treinamento de vendas"
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                Data e hora
              </label>
              <input
                type="datetime-local"
                value={form.data_hora}
                onChange={(e) =>
                  setForm({ ...form, data_hora: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                Local (opcional)
              </label>
              <input
                type="text"
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
                placeholder="Ex: Escritório"
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">
              Descrição (opcional)
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) =>
                setForm({ ...form, descricao: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-2 block font-sans text-sm font-medium text-navy">
              Quem deve participar?
            </label>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {corretores.length === 0 ? (
                <p className="p-2 font-sans text-sm text-slate-400">
                  Nenhum corretor ativo encontrado.
                </p>
              ) : (
                corretores.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 font-sans text-sm text-navy hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selecionados.includes(c.id)}
                      onChange={() => alternarCorretor(c.id)}
                      className="h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold"
                    />
                    {c.nome}
                  </label>
                ))
              )}
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
            {salvando ? "Salvando..." : "Criar evento"}
          </button>
        </div>
      </div>
    </div>
  );
}
