"use client";

import { useState } from "react";
import NovaUnidadeModal from "../components/NovaUnidadeModal";

export default function UnidadesPage() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="space-y-8">

        {/* Cabeçalho */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="font-display text-4xl font-bold text-navy">
              Unidades
            </h1>

            <p className="mt-2 font-sans text-slate-500">
              Gerencie todas as unidades dos empreendimentos.
            </p>

          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
          >
            + Nova Unidade
          </button>

        </div>

        {/* KPIs */}

        <div className="grid grid-cols-4 gap-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="font-sans text-slate-500">
              Disponíveis
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold text-emerald-600">
              0
            </h2>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="font-sans text-slate-500">
              Reservadas
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold text-amber-500">
              0
            </h2>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="font-sans text-slate-500">
              Vendidas
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold text-red-500">
              0
            </h2>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="font-sans text-slate-500">
              VGV
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold text-gold">
              R$ 0
            </h2>

          </div>

        </div>

        {/* Barra de Pesquisa */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <input
            type="text"
            placeholder="Pesquisar unidade..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy placeholder:text-slate-400 outline-none focus:border-gold"
          />

        </div>

        {/* Tabela */}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="font-display text-2xl font-bold text-navy">
              Lista de Unidades
            </h2>

            <span className="font-sans text-sm text-slate-400">
              0 registros
            </span>

          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left font-sans text-slate-500">
                    Número
                  </th>

                  <th className="px-6 py-4 text-left font-sans text-slate-500">
                    Andar
                  </th>

                  <th className="px-6 py-4 text-left font-sans text-slate-500">
                    Quartos
                  </th>

                  <th className="px-6 py-4 text-left font-sans text-slate-500">
                    Área
                  </th>

                  <th className="px-6 py-4 text-left font-sans text-slate-500">
                    Preço
                  </th>

                  <th className="px-6 py-4 text-left font-sans text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center font-sans text-slate-500">
                    Ações
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td
                    colSpan={7}
                    className="py-24 text-center font-sans text-slate-400"
                  >
                    Nenhuma unidade cadastrada.
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* Modal */}

      <NovaUnidadeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
