"use client";

interface Props {
  vendidas: number;
  reservadas: number;
  disponiveis: number;
}

export default function ProgressCard({
  vendidas,
  reservadas,
  disponiveis,
}: Props) {

  const total =
    vendidas +
    reservadas +
    disponiveis;

  const percentual =
    total === 0
      ? 0
      : ((vendidas + reservadas) / total) * 100;

  return (

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="flex items-center justify-between">

        <h3 className="text-xl font-semibold text-white">

          Comercialização

        </h3>

        <span className="text-3xl font-bold text-[#C8A96A]">

          {percentual.toFixed(0)}%

        </span>

      </div>

      <div className="mt-8 h-5 overflow-hidden rounded-full bg-zinc-800">

        <div
          className="h-full rounded-full bg-gradient-to-r from-[#B68B2C] to-[#D9B56D]"
          style={{
            width: `${percentual}%`,
          }}
        />

      </div>

      <div className="mt-6 flex justify-between text-sm">

        <span className="text-emerald-400">

          Vendidas {vendidas}

        </span>

        <span className="text-yellow-400">

          Reservadas {reservadas}

        </span>

        <span className="text-white">

          Disponíveis {disponiveis}

        </span>

      </div>

    </div>

  );

}