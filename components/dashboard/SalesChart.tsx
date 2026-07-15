"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { mes: "Jan", vendas: 12 },
  { mes: "Fev", vendas: 19 },
  { mes: "Mar", vendas: 17 },
  { mes: "Abr", vendas: 26 },
  { mes: "Mai", vendas: 31 },
  { mes: "Jun", vendas: 42 },
  { mes: "Jul", vendas: 48 },
];

export default function SalesChart() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Evolução de Vendas
          </h2>

          <p className="text-sm text-zinc-500">
            Últimos 7 meses
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
          +18%
        </span>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="gold"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#C8A96A"
                stopOpacity={0.6}
              />

              <stop
                offset="95%"
                stopColor="#C8A96A"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            stroke="#27272a"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="mes"
            stroke="#71717a"
          />

          <Tooltip 
          contentStyle={{
    background: "#18181B",
    border: "1px solid #C8A96A33",
    borderRadius: "16px",
    color: "#fff",
  }}
  labelStyle={{
    color: "#C8A96A",
  }}
  />

          <Area
            type="monotone"
            dataKey="vendas"
            stroke="#C8A96A"
            strokeWidth={3}
            fill="url(#gold)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}