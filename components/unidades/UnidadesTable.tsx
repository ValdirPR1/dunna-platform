"use client";

import {
  Building2,
  Home,
  Search,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

const unidades = [
  {
    numero: "101",
    empreendimento: "Porto Life",
    tipo: "2 Quartos",
    area: "58m²",
    valor: "R$ 690.000",
    status: "Disponível",
  },
  {
    numero: "305",
    empreendimento: "Ocean View",
    tipo: "Studio",
    area: "34m²",
    valor: "R$ 540.000",
    status: "Reservada",
  },
  {
    numero: "702",
    empreendimento: "Makai",
    tipo: "3 Suítes",
    area: "142m²",
    valor: "R$ 1.890.000",
    status: "Vendida",
  },
];

function Status({
  value,
}: {
  value: string;
}) {
  const color =
    value === "Disponível"
      ? "bg-emerald-500/20 text-emerald-300"
      : value === "Reservada"
      ? "bg-amber-500/20 text-amber-300"
      : "bg-red-500/20 text-red-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {value}
    </span>
  );
}

export default function UnidadesTable() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between">

        <div className="relative w-96">

          <Search
            size={18}
            className="absolute left-4 top-4 text-zinc-500"
          />

          <input
            placeholder="Buscar unidade..."
            className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900 pl-11 text-white outline-none focus:border-[#C8A96A]"
          />

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

        <table className="w-full">

          <thead className="border-b border-zinc-800 bg-zinc-950">

            <tr className="text-left text-sm uppercase text-zinc-500">

              <th className="px-6 py-4">Unidade</th>
              <th className="px-6 py-4">Empreendimento</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Área</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>

            </tr>

          </thead>

          <tbody>

            {unidades.map((u) => (

              <tr
                key={u.numero}
                className="border-b border-zinc-800 hover:bg-zinc-800/40"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-[#C8A96A]/10 p-3">

                      <Home
                        size={20}
                        className="text-[#C8A96A]"
                      />

                    </div>

                    <span className="font-semibold">
                      {u.numero}
                    </span>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    <Building2
                      size={16}
                      className="text-[#C8A96A]"
                    />

                    {u.empreendimento}

                  </div>

                </td>

                <td className="px-6 py-5">
                  {u.tipo}
                </td>

                <td className="px-6 py-5">
                  {u.area}
                </td>

                <td className="px-6 py-5 font-semibold">
                  {u.valor}
                </td>

                <td className="px-6 py-5">
                  <Status value={u.status} />
                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2">

                    <button className="rounded-xl p-2 hover:bg-zinc-800">
                      <Eye size={18}/>
                    </button>

                    <button className="rounded-xl p-2 hover:bg-zinc-800">
                      <Pencil size={18}/>
                    </button>

                    <button className="rounded-xl p-2 hover:bg-red-500/10">
                      <Trash2 size={18}/>
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}