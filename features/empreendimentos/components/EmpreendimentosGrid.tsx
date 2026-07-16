"use client";

import Link from "next/link";
import { Empreendimento } from "../types/empreendimento";

interface Props {
  empreendimentos: Empreendimento[];
}

export default function EmpreendimentosGrid({
  empreendimentos,
}: Props) {
  if (empreendimentos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          Nenhum empreendimento cadastrado
        </h2>

        <p className="mt-3 text-slate-500">
          Clique em "Novo Empreendimento" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {empreendimentos.map((item) => (
        <Link
          key={item.id}
          href={`/empreendimentos/${item.id}`}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-5 h-44 rounded-2xl bg-slate-100" />

          <h2 className="text-xl font-semibold text-slate-900">
            {item.nome}
          </h2>

          <p className="mt-2 text-slate-500">
            {item.cidade}
          </p>

          <div className="mt-5 flex items-center justify-between">

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              {item.status}
            </span>

            <span className="text-sm text-slate-400">
              {item.total_disponiveis} disponíveis
            </span>

          </div>
        </Link>
      ))}
    </div>
  );
}