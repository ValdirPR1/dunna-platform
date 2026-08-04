"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { upsertMeta } from "../services/metas.service";
import { Meta, METRICAS, TipoMetrica } from "../types/meta";
import { Corretor } from "@/features/unidades/types/unidade";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  corretor: Corretor | null;
  metas: Meta[];
  usuarioId: string;
}

export default function EditarMetasModal({
  open,
  onClose,
  onSaved,
  corretor,
  metas,
  usuarioId,
}: Props) {
  const [valores, setValores] = useState<Record<TipoMetrica, number>>(
    {} as Record<TipoMetrica, number>
  );
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) return;

    const iniciais = {} as Record<TipoMetrica, number>;
    METRICAS.forEach((m) => {
      const existente = metas.find((meta) => meta.tipo_metrica === m.tipo);
      iniciais[m.tipo] = existente?.valor_alvo ?? 0;
    });
    setValores(iniciais);
  }, [open, metas]);

  if (!open || !corretor) return null;

  async function handleSalvar() {
    if (!corretor) return;
    setSalvando(true);
    try {
      await Promise.all(
        METRICAS.map((m) =>
          upsertMeta(corretor.id, m.tipo, valores[m.tipo] ?? 0, usuarioId)
        )
      );
      toast.success("Metas atualizadas.");
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar as metas.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">
            Metas de {corretor.nome}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-5 font-sans text-sm text-slate-500">
          Defina o alvo de cada métrica. O corretor vai lançar o que
          realizou pra acompanharem juntos.
        </p>

        <div className="space-y-4">
          {METRICAS.map((m) => (
            <div key={m.tipo}>
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                {m.label} <span className="text-slate-400">({m.labelPeriodo})</span>
              </label>
              <input
                type="number"
                min={0}
                value={valores[m.tipo] ?? 0}
                onChange={(e) =>
                  setValores({
                    ...valores,
                    [m.tipo]: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
          ))}
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
            {salvando ? "Salvando..." : "Salvar metas"}
          </button>
        </div>
      </div>
    </div>
  );
}
