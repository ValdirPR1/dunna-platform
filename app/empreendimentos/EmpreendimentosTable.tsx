"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Building2,
} from "lucide-react";

import { listarEmpreendimentos } from "@/services/empreendimentos";

interface Empreendimento {
  id: string;
  nome: string;
  cidade: string;
  bairro: string;
  status: string;
  tipo: string;
  valor_inicial: number;
  construtora: string;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pronto: "bg-emerald-500/20 text-emerald-300",
    "Em Obras": "bg-amber-500/20 text-amber-300",
    Lançamento: "bg-sky-500/20 text-sky-300",
    "Pré-Lançamento": "bg-purple-500/20 text-purple-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        colors[status] ?? "bg-zinc-700 text-zinc-200"
      }`}
    >
      {status || "-"}
    </span>
  );
}

export default function EmpreendimentosTable() {
  const [empreendimentos, setEmpreendimentos] = useState<
    Empreendimento[]
  >([]);

  const [busca, setBusca] = useState("");

  async function carregar() {
    const data = await listarEmpreendimentos();
    setEmpreendimentos(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = empreendimentos.filter((emp) =>
    emp.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div className="relative w-96">

          <Search
            size={18}
            className="absolute left-4 top-4 text-zinc-500"
          />

          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar empreendimento..."
            className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900 pl-11 pr-4 text-white outline-none focus:border-[#C8A96A]"
          />

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

        <table className="w-full">

          <thead className="border-b border-zinc-800 bg-zinc-950">

            <tr className="text-left text-sm uppercase tracking-wide text-zinc-500">

              <th className="px-6 py-4">Empreendimento</th>
              <th className="px-6 py-4">Cidade</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Valor Inicial</th>
              <th className="px-6 py-4">Construtora</th>
              <th className="px-6 py-4 text-right">Ações</th>

            </tr>

          </thead>

          <tbody>

            {filtrados.map((item) => (

              <tr
                key={item.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/40"
              >

                <td className="px-6 py-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C8A96A]/15">

                      <Building2
                        size={22}
                        className="text-[#C8A96A]"
                      />

                    </div>

                    <p className="font-semibold text-white">
                      {item.nome}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <div className="flex items-center gap-2 text-zinc-300">

                    <MapPin
                      size={16}
                      className="text-[#C8A96A]"
                    />

                    {item.cidade}

                  </div>

                </td>

                <td className="px-6 py-5">

                  <StatusBadge status={item.status} />

                </td>

                <td className="px-6 py-5 font-semibold text-white">

                  {Number(item.valor_inicial).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}

                </td>

                <td className="px-6 py-5">

                  {item.construtora || "-"}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-end gap-2">

                    <button className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                      <Eye size={18} />
                    </button>

                    <button
  onClick={() => {
    console.log(item);
  }}
  className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-[#C8A96A]"
>
  <Pencil size={18} />
</button>

                    <button className="rounded-xl p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 size={18} />
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