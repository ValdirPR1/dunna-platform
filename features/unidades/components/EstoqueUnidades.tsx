"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus } from "lucide-react";

import { listarUnidades } from "../services/unidade.service";

interface Props {
  empreendimentoId: string;
}

export default function EstoqueUnidades({
  empreendimentoId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [unidades, setUnidades] = useState<any[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await listarUnidades(
        empreendimentoId
      );

      setUnidades(data);
    } finally {
      setLoading(false);
    }
  }

  const disponiveis = useMemo(
    () =>
      unidades.filter(
        (u) => u.status === "Disponível"
      ).length,
    [unidades]
  );

  const reservadas = useMemo(
    () =>
      unidades.filter(
        (u) => u.status === "Reservada"
      ).length,
    [unidades]
  );

  const vendidas = useMemo(
    () =>
      unidades.filter(
        (u) => u.status === "Vendida"
      ).length,
    [unidades]
  );

  const vgv = useMemo(() => {
    return unidades.reduce(
      (total, item) =>
        total +
        Number(
          item.preco_promocional ||
            item.preco_tabela ||
            0
        ),
      0
    );
  }, [unidades]);

  return (
    <section className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Estoque
          </h2>

          <p className="mt-2 text-zinc-500">
            Gestão das unidades.
          </p>

        </div>

        <button
          onClick={() =>
            router.push(
              `/empreendimentos/${empreendimentoId}/unidades/nova`
            )
          }
          className="flex items-center gap-2 rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-black hover:brightness-110"
        >
          <Plus size={18} />

          Nova Unidade
        </button>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <Card
          titulo="Disponíveis"
          valor={String(disponiveis)}
        />

        <Card
          titulo="Reservadas"
          valor={String(reservadas)}
        />

        <Card
          titulo="Vendidas"
          valor={String(vendidas)}
        />

        <Card
          titulo="VGV"
          valor={vgv.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        />

      </div>

      {loading ? (

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center text-zinc-500">

          Carregando...

        </div>

      ) : unidades.length === 0 ? (

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-16 text-center">

          <Building2
            size={54}
            className="mx-auto text-zinc-600"
          />

          <h3 className="mt-5 text-xl font-semibold text-white">
            Nenhuma unidade cadastrada
          </h3>

          <p className="mt-2 text-zinc-500">
            Clique em "Nova Unidade" para começar.
          </p>

        </div>

      ) : (

        <div className="overflow-hidden rounded-3xl border border-zinc-800">

          <table className="w-full">

            <thead className="bg-zinc-900">

              <tr className="text-left text-sm text-zinc-400">

                <th className="px-6 py-4">
                  Unidade
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Área
                </th>

                <th className="px-6 py-4">
                  Valor
                </th>

              </tr>

            </thead>

            <tbody>

              {unidades.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900"
                >

                  <td className="px-6 py-5 text-white">

                    {item.numero}

                  </td>

                  <td className="px-6 py-5">

                    {item.status}

                  </td>

                  <td className="px-6 py-5">

                    {item.area_privativa} m²

                  </td>

                  <td className="px-6 py-5 font-semibold text-white">

                    {Number(
                      item.preco_promocional ||
                        item.preco_tabela
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}

function Card({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

      <p className="text-sm text-zinc-500">
        {titulo}
      </p>

      <h3 className="mt-3 text-3xl font-bold text-white">
        {valor}
      </h3>

    </div>
  );
}