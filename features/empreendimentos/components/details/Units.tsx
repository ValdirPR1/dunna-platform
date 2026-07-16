"use client";

import { useEffect, useState } from "react";
import NovaUnidadeModal from "@/features/unidades/components/NovaUnidadeModal";
import { listarUnidades } from "@/features/unidades/services/unidade.service";
import {
  EmpreendimentoResumo,
  Unidade,
} from "@/features/unidades/types/unidade";

interface Props {
  empreendimento: EmpreendimentoResumo;
}

function formatarPreco(valor: number | null) {
  if (!valor) return "—";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function Units({ empreendimento }: Props) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarUnidades(empreendimento.id);
      setUnidades(data as Unidade[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [empreendimento.id]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="font-display text-2xl font-bold text-navy">
            Unidades
          </h2>

          <p className="mt-1 font-sans text-slate-500">
            Unidades cadastradas neste empreendimento.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-gold px-5 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          + Nova Unidade
        </button>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Número</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Área</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Quartos</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Preço</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Status</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center font-sans text-slate-400">
                  Carregando...
                </td>
              </tr>
            ) : unidades.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center font-sans text-slate-400">
                  Nenhuma unidade cadastrada.
                </td>
              </tr>
            ) : (
              unidades.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-sans text-navy">{u.numero}</td>
                  <td className="px-5 py-4 font-sans text-navy">{u.area ? `${u.area}m²` : "—"}</td>
                  <td className="px-5 py-4 font-sans text-navy">{u.quartos ?? "—"}</td>
                  <td className="px-5 py-4 font-sans text-navy">{formatarPreco(u.preco)}</td>
                  <td className="px-5 py-4 font-sans text-navy">{u.status}</td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      <NovaUnidadeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSaved={carregar}
        empreendimentoFixo={empreendimento}
      />

    </section>
  );
}
