"use client";

import {
  TrendingUp,
  MapPinned,
  ArrowUpRight,
} from "lucide-react";

const regioes = [
  {
    nome: "Porto de Galinhas",
    score: 99,
    valorizacao: "+18%",
    rentabilidade: "15,4%",
    status: "Alta Procura",
  },
  {
    nome: "Muro Alto",
    score: 97,
    valorizacao: "+16%",
    rentabilidade: "14,2%",
    status: "Mercado Aquecido",
  },
  {
    nome: "Praia dos Carneiros",
    score: 95,
    valorizacao: "+15%",
    rentabilidade: "13,8%",
    status: "Excelente Potencial",
  },
  {
    nome: "Tamandaré",
    score: 91,
    valorizacao: "+12%",
    rentabilidade: "12,5%",
    status: "Crescimento Contínuo",
  },
];

export default function MarketRadar() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-[#C8A96A]/10 p-3">

            <MapPinned
              className="text-[#C8A96A]"
              size={24}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Radar de Mercado
            </h2>

            <p className="text-sm text-zinc-500">
              Índice de oportunidades
            </p>

          </div>

        </div>

        <div className="rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

          Mercado Aquecido

        </div>

      </div>

      <div className="space-y-8">

        {regioes.map((regiao) => (

          <div key={regiao.nome}>

            <div className="flex items-start justify-between mb-3">

              <div>

                <h3 className="font-semibold text-lg">
                  {regiao.nome}
                </h3>

                <div className="flex gap-2 mt-2">

                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">

                    ▲ {regiao.status}

                  </span>

                  <span className="rounded-full bg-[#C8A96A]/10 px-2 py-1 text-xs text-[#C8A96A]">

                    Rent. {regiao.rentabilidade}

                  </span>

                </div>

              </div>

              <div className="text-right">

                <p className="text-3xl font-bold text-[#C8A96A]">

                  {regiao.score}%

                </p>

                <p className="flex items-center justify-end gap-1 text-sm text-emerald-400">

                  <ArrowUpRight size={14} />

                  {regiao.valorizacao}

                </p>

              </div>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

              <div
                className="h-full rounded-full bg-gradient-to-r from-[#B68B2C] via-[#C8A96A] to-[#E5C87A] transition-all duration-700"
                style={{
                  width: `${regiao.score}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/20 p-5">

        <div className="flex items-center gap-3">

          <TrendingUp
            className="text-[#C8A96A]"
            size={22}
          />

          <div>

            <h3 className="font-semibold">
              Insight da IA
            </h3>

            <p className="text-sm text-zinc-400">

              Porto de Galinhas continua sendo a região
              com maior liquidez e melhor relação entre
              valorização e rentabilidade.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}