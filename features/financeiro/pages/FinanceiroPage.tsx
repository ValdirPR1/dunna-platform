"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  NegocioFechado,
  atualizarComissao,
  calcularVendasPorMes,
  listarNegociosFechados,
} from "../services/financeiro.service";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function AnimatedValor({ numero }: { numero: number }) {
  const [valorAnimado, setValorAnimado] = useState(0);

  useEffect(() => {
    let quadro: number;
    const inicio = performance.now();
    const duracao = 900;

    function animar(agora: number) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      setValorAnimado(Math.round(numero * suavizado));

      if (progresso < 1) quadro = requestAnimationFrame(animar);
    }

    quadro = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(quadro);
  }, [numero]);

  return <>{formatarPreco(valorAnimado)}</>;
}

export default function FinanceiroPage() {
  const [negocios, setNegocios] = useState<NegocioFechado[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    try {
      const dados = await listarNegociosFechados();
      setNegocios(dados);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const vgvTotal = useMemo(
    () => negocios.reduce((soma, n) => soma + n.valor, 0),
    [negocios]
  );

  const ticketMedio = negocios.length > 0 ? vgvTotal / negocios.length : 0;

  const dadosGrafico = useMemo(
    () => calcularVendasPorMes(negocios),
    [negocios]
  );

  async function handleComissaoPercentual(id: string, valor: string) {
    const numero = valor ? Number(valor) : null;
    try {
      await atualizarComissao(id, { comissao_percentual: numero });
      setNegocios((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, comissao_percentual: numero } : n
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a comissão.");
    }
  }

  async function handleTogglePago(negocio: NegocioFechado) {
    try {
      await atualizarComissao(negocio.id, {
        comissao_paga: !negocio.comissao_paga,
      });
      setNegocios((prev) =>
        prev.map((n) =>
          n.id === negocio.id ? { ...n, comissao_paga: !n.comissao_paga } : n
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar.");
    }
  }

  return (
    <div>

      <h1 className="font-display text-3xl font-bold text-navy">
        Financeiro
      </h1>

      <p className="mt-2 font-sans text-slate-500">
        VGV vendido, ticket médio e comissões dos negócios fechados.
      </p>

      {/* Cards */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="font-sans text-slate-500">VGV Vendido</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-navy">
            <AnimatedValor numero={vgvTotal} />
          </h2>
          <p className="mt-2 font-sans text-sm text-slate-400">
            {negocios.length} negócios fechados
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="font-sans text-slate-500">Ticket Médio</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-gold">
            <AnimatedValor numero={ticketMedio} />
          </h2>
          <p className="mt-2 font-sans text-sm text-slate-400">
            Por negócio fechado
          </p>
        </div>

      </div>

      {/* Gráfico */}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Vendas por mês
        </h2>

        {dadosGrafico.length === 0 ? (

          <p className="mt-6 font-sans text-slate-400">
            Ainda não há negócios fechados suficientes pra montar o gráfico.
          </p>

        ) : (

          <div className="mt-6 h-72">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(valor: number) => formatarPreco(valor)}
                  contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
                />
                <Bar
                  dataKey="total"
                  fill="#C8A96A"
                  radius={[8, 8, 0, 0]}
                  animationDuration={900}
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

        )}

      </div>

      {/* Tabela de comissões */}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Comissões
        </h2>

        {loading ? (

          <p className="mt-6 font-sans text-slate-400">Carregando...</p>

        ) : negocios.length === 0 ? (

          <p className="mt-6 font-sans text-slate-400">
            Nenhum negócio fechado ainda.
          </p>

        ) : (

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">

            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Cliente</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Corretor</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Valor</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Comissão %</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Valor Comissão</th>
                  <th className="px-5 py-4 text-center font-sans text-slate-500">Status</th>
                </tr>
              </thead>

              <tbody>

                {negocios.map((n) => {
                  const valorComissao = n.comissao_percentual
                    ? (n.valor * n.comissao_percentual) / 100
                    : 0;

                  return (
                    <tr key={n.id} className="border-t border-slate-100">

                      <td className="px-5 py-4 font-sans text-navy">
                        {n.pessoaNome}
                      </td>

                      <td className="px-5 py-4 font-sans text-slate-500">
                        {n.corretorNome ?? "—"}
                      </td>

                      <td className="px-5 py-4 font-sans text-navy">
                        {formatarPreco(n.valor)}
                      </td>

                      <td className="px-5 py-4">
                        <input
                          type="number"
                          defaultValue={n.comissao_percentual ?? ""}
                          onBlur={(e) =>
                            handleComissaoPercentual(n.id, e.target.value)
                          }
                          placeholder="0"
                          className="w-20 rounded-lg border border-slate-200 p-2 font-sans text-sm"
                        />
                        %
                      </td>

                      <td className="px-5 py-4 font-sans text-gold font-semibold">
                        {formatarPreco(valorComissao)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleTogglePago(n)}
                          className={`rounded-full px-4 py-1 font-sans text-xs font-semibold ${
                            n.comissao_paga
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {n.comissao_paga ? "Pago" : "Pendente"}
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}
