"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PeriodoVisualizacoes,
  VisualizacaoPorDia,
  listarVisualizacoesPorDia,
} from "@/features/dashboard/services/visualizacoes.service";

const OPCOES_PERIODO: { valor: PeriodoVisualizacoes; rotulo: string }[] = [
  { valor: "7d", rotulo: "7 dias" },
  { valor: "30d", rotulo: "30 dias" },
  { valor: "total", rotulo: "Total" },
];

export default function ImoveisVisualizadosPanel() {
  const [periodo, setPeriodo] = useState<PeriodoVisualizacoes>("30d");
  const [dados, setDados] = useState<VisualizacaoPorDia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listarVisualizacoesPorDia(periodo)
      .then(setDados)
      .finally(() => setLoading(false));
  }, [periodo]);

  const totalPeriodo = dados.reduce((soma, item) => soma + item.total, 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <Eye className="text-[#C8A96A]" />
          <div>
            <h2 className="text-xl font-semibold">
              Visualizações de Imóveis
            </h2>
            <p className="text-sm text-slate-400">
              {totalPeriodo} visualizações no período
            </p>
          </div>
        </div>

        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {OPCOES_PERIODO.map((opcao) => (
            <button
              key={opcao.valor}
              onClick={() => setPeriodo(opcao.valor)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                periodo === opcao.valor
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>

      </div>

      {loading ? (

        <p className="text-sm text-slate-400">Carregando...</p>

      ) : dados.length === 0 || totalPeriodo === 0 ? (

        <p className="text-sm text-slate-400">
          Ainda não há visualizações registradas nesse período.
        </p>

      ) : (

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ left: 0, right: 20, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="data"
                stroke="#94a3b8"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
              <Line
                type="monotone"
                dataKey="total"
                name="Visualizações"
                stroke="#C8A96A"
                strokeWidth={2.5}
                dot={dados.length <= 31}
                activeDot={{ r: 5 }}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
}
