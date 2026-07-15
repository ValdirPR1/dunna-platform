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

            <h1 className="text-4xl font-bold text-white">
              Unidades
            </h1>

            <p className="mt-2 text-zinc-400">
              Gerencie todas as unidades dos empreendimentos.
            </p>

          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[#C8A96A] px-6 py-3 font-semibold text-black transition hover:brightness-110"
          >
            + Nova Unidade
          </button>

        </div>

        {/* KPIs */}

        <div className="grid grid-cols-4 gap-6">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <p className="text-zinc-500">
              Disponíveis
            </p>

            <h2 className="mt-4 text-4xl font-bold text-green-500">
              0
            </h2>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <p className="text-zinc-500">
              Reservadas
            </p>

            <h2 className="mt-4 text-4xl font-bold text-yellow-500">
              0
            </h2>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <p className="text-zinc-500">
              Vendidas
            </p>

            <h2 className="mt-4 text-4xl font-bold text-red-500">
              0
            </h2>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <p className="text-zinc-500">
              VGV
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#C8A96A]">
              R$ 0
            </h2>

          </div>

        </div>

        {/* Barra de Pesquisa */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <input
            type="text"
            placeholder="Pesquisar unidade..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white placeholder:text-zinc-500 outline-none focus:border-[#C8A96A]"
          />

        </div>

        {/* Tabela */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold text-white">
              Lista de Unidades
            </h2>

            <span className="text-sm text-zinc-500">
              0 registros
            </span>

          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800">

            <table className="w-full">

              <thead className="bg-zinc-800">

                <tr>

                  <th className="px-6 py-4 text-left text-zinc-400">
                    Número
                  </th>

                  <th className="px-6 py-4 text-left text-zinc-400">
                    Andar
                  </th>

                  <th className="px-6 py-4 text-left text-zinc-400">
                    Quartos
                  </th>

                  <th className="px-6 py-4 text-left text-zinc-400">
                    Área
                  </th>

                  <th className="px-6 py-4 text-left text-zinc-400">
                    Preço
                  </th>

                  <th className="px-6 py-4 text-left text-zinc-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-zinc-400">
                    Ações
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td
                    colSpan={7}
                    className="py-24 text-center text-zinc-500"
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