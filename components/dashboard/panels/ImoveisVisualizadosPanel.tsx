"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, X } from "lucide-react";
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
  ImovelVisualizadoNoDia,
  PeriodoVisualizacoes,
  VisualizacaoPorDia,
  listarImoveisVisualizadosNoDia,
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

  const [diaSelecionado, setDiaSelecionado] = useState<VisualizacaoPorDia | null>(null);
  const [imoveisDoDia, setImoveisDoDia] = useState<ImovelVisualizadoNoDia[]>([]);
  const [carregandoDia, setCarregandoDia] = useState(false);

  useEffect(() => {
    setLoading(true);
    setDiaSelecionado(null);
    listarVisualizacoesPorDia(periodo)
      .then(setDados)
      .finally(() => setLoading(false));
  }, [periodo]);

  function abrirDia(chave: string) {
    const ponto = dados.find((d) => d.chave === chave);
    if (!ponto || ponto.total === 0) return;

    setDiaSelecionado(ponto);
    setCarregandoDia(true);
    listarImoveisVisualizadosNoDia(chave)
      .then(setImoveisDoDia)
      .finally(() => setCarregandoDia(false));
  }

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
              {totalPeriodo} visualizações no período — clique num dia
              do gráfico pra ver quais imóveis foram vistos
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

        <div className="h-72 cursor-pointer">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dados}
              margin={{ left: 0, right: 20, top: 10 }}
              onClick={(estado) => {
                const indice = Number(estado?.activeIndex);
                const ponto = Number.isInteger(indice) ? dados[indice] : undefined;
                if (ponto) abrirDia(ponto.chave);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="data"
                stroke="#94a3b8"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} width={30} />
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
                labelFormatter={(rotulo) => `${rotulo} — clique pra ver os imóveis`}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Visualizações"
                stroke="#C8A96A"
                strokeWidth={2.5}
                dot={dados.length <= 31}
                activeDot={{ r: 6 }}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      )}

      {diaSelecionado && (

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="font-semibold text-slate-800">
              Imóveis vistos em {diaSelecionado.data}
              <span className="ml-2 font-normal text-slate-400">
                ({diaSelecionado.total} visualizaç{diaSelecionado.total === 1 ? "ão" : "ões"})
              </span>
            </h3>

            <button
              onClick={() => setDiaSelecionado(null)}
              aria-label="Fechar"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X size={18} />
            </button>

          </div>

          {carregandoDia ? (

            <p className="text-sm text-slate-400">Carregando...</p>

          ) : (

            <ul className="flex flex-col gap-2">

              {imoveisDoDia.map((imovel) => (

                <li
                  key={imovel.imovelId}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                >

                  <Link
                    href={`/imoveis/${imovel.imovelId}/editar`}
                    className="font-medium text-slate-700 hover:text-[#B68B2C] hover:underline"
                  >
                    {imovel.titulo}
                  </Link>

                  <span className="rounded-full bg-[#C8A96A]/10 px-3 py-1 text-sm font-semibold text-[#B68B2C]">
                    {imovel.totalVisualizacoes}x
                  </span>

                </li>

              ))}

            </ul>

          )}

        </div>

      )}

    </div>
  );
}
