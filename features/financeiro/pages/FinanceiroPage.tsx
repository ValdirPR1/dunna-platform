"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Pencil, TrendingUp, Clock } from "lucide-react";
import {
  NegocioFechado,
  calcularVendasPorMes,
  listarNegociosFechados,
} from "../services/financeiro.service";
import { listarComissoes } from "../services/comissoes.service";
import { Comissao } from "../types/comissao";
import DefinirComissaoModal from "../components/DefinirComissaoModal";
import { useAuth } from "@/features/core/auth/useAuth";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function chaveDoMes(dataISO: string) {
  return dataISO.slice(0, 7); // YYYY-MM
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
  const { usuario } = useAuth();
  const [negocios, setNegocios] = useState<NegocioFechado[]>([]);
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Comissao | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const [dadosNegocios, dadosComissoes] = await Promise.all([
        listarNegociosFechados(),
        listarComissoes(),
      ]);
      setNegocios(dadosNegocios);
      setComissoes(dadosComissoes);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const vgvTotal = useMemo(() => negocios.reduce((soma, n) => soma + n.valor, 0), [negocios]);
  const ticketMedio = negocios.length > 0 ? vgvTotal / negocios.length : 0;
  const dadosGrafico = useMemo(() => calcularVendasPorMes(negocios), [negocios]);

  const mesAtual = new Date().toISOString().slice(0, 7);
  const comissoesDoMes = comissoes.filter(
    (c) => c.criado_em && chaveDoMes(c.criado_em) === mesAtual
  );
  const comissaoImobiliariaDoMes = comissoesDoMes.reduce(
    (soma, c) => soma + (c.valor_comissao_imobiliaria ?? 0),
    0
  );
  const comissaoCorretoresDoMes = comissoesDoMes.reduce(
    (soma, c) => soma + (c.valor_comissao_corretor ?? 0),
    0
  );
  const pendentes = comissoes.filter((c) => c.status === "a_definir");

  return (
    <div>

      <h1 className="font-display text-3xl font-bold text-navy">
        Financeiro
      </h1>

      <p className="mt-2 font-sans text-slate-500">
        VGV vendido, ticket médio e comissões dos negócios fechados.
      </p>

      {/* Cards */}

      <div className="mt-8 grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-sans text-sm text-slate-500">VGV Vendido</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy">
            <AnimatedValor numero={vgvTotal} />
          </h2>
          <p className="mt-2 font-sans text-xs text-slate-400">
            {negocios.length} negócio{negocios.length === 1 ? "" : "s"} fechado{negocios.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-sans text-sm text-slate-500">Ticket Médio</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-gold">
            <AnimatedValor numero={ticketMedio} />
          </h2>
          <p className="mt-2 font-sans text-xs text-slate-400">Por negócio fechado</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-sans text-sm text-slate-500">Comissão imobiliária (mês)</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy">
            <AnimatedValor numero={comissaoImobiliariaDoMes} />
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-sans text-sm text-slate-500">Comissão corretores (mês)</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-gold-dark">
            <AnimatedValor numero={comissaoCorretoresDoMes} />
          </h2>
        </div>

      </div>

      {pendentes.length > 0 && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-800">
          <Clock size={16} />
          {pendentes.length} venda{pendentes.length === 1 ? "" : "s"} com contrato assinado aguardando você definir a comissão.
        </div>
      )}

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
                  formatter={(valor) => formatarPreco(Number(valor))}
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

      {/* Comissões */}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Comissões
        </h2>

        {loading ? (

          <p className="mt-6 font-sans text-slate-400">Carregando...</p>

        ) : comissoes.length === 0 ? (

          <p className="mt-6 font-sans text-slate-400">
            Nenhuma venda com contrato assinado ainda.
          </p>

        ) : (

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">

            <table className="w-full min-w-[760px]">

              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Cliente</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Corretor</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Valor da venda</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Comissão corretor</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Recebimento</th>
                  <th className="px-5 py-4 text-center font-sans text-slate-500">Status</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody>
                {comissoes.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">

                    <td className="px-5 py-4 font-sans text-navy">
                      {c.oportunidade?.pessoaNome ?? c.oportunidade?.titulo ?? "—"}
                    </td>

                    <td className="px-5 py-4 font-sans text-slate-500">
                      {c.corretor?.nome ?? "—"}
                    </td>

                    <td className="px-5 py-4 font-sans text-navy">
                      {formatarPreco(c.valor_venda ?? 0)}
                    </td>

                    <td className="px-5 py-4 font-sans font-semibold text-gold">
                      {c.status === "definida" ? formatarPreco(c.valor_comissao_corretor ?? 0) : "—"}
                    </td>

                    <td className="px-5 py-4 font-sans text-slate-500">
                      {c.status === "definida"
                        ? c.forma_recebimento === "parcelado"
                          ? `Parcelado (${c.parcelas}x)`
                          : "À vista"
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-center">
                      {c.status === "definida" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-sans text-xs font-semibold text-emerald-700">
                          <TrendingUp size={12} />
                          Definida
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 font-sans text-xs font-semibold text-amber-700">
                          <Clock size={12} />
                          A definir
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditando(c);
                          setModalAberto(true);
                        }}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        )}

      </div>

      <DefinirComissaoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSaved={carregar}
        comissao={editando}
        usuarioId={usuario?.id ?? ""}
      />

    </div>
  );
}
