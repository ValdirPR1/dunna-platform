"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Plus, Trash2, Copy, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { listarComissoes } from "../services/comissoes.service";
import {
  listarContasPagar,
  marcarContaPaga,
  excluirContaPagar,
  duplicarContaPagar,
} from "../services/contasPagar.service";
import {
  listarBonificacoes,
  excluirBonificacao,
} from "../services/bonificacoes.service";
import { Comissao } from "../types/comissao";
import { ContaPagar, Bonificacao, labelCategoria } from "../types/admFinanceiro";
import NovaContaPagarModal from "./NovaContaPagarModal";
import NovaBonificacaoModal from "./NovaBonificacaoModal";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import { useAuth } from "@/features/core/auth/useAuth";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function chaveMes(dataISO: string) {
  const d = new Date(dataISO);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

function mesAtualChave() {
  return new Date().toISOString().slice(0, 7);
}

export default function AdmFinanceiro() {
  const { usuario } = useAuth();
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [bonificacoes, setBonificacoes] = useState<Bonificacao[]>([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalContaAberto, setModalContaAberto] = useState(false);
  const [modalBonificacaoAberto, setModalBonificacaoAberto] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const [dadosComissoes, dadosContas, dadosBonificacoes, dadosCorretores] = await Promise.all([
        listarComissoes(),
        listarContasPagar(),
        listarBonificacoes(),
        listarCorretoresAtivos(),
      ]);
      setComissoes(dadosComissoes);
      setContas(dadosContas);
      setBonificacoes(dadosBonificacoes);
      setCorretores(dadosCorretores);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleTogglePaga(conta: ContaPagar) {
    try {
      await marcarContaPaga(conta.id, conta.status !== "pago");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar a conta.");
    }
  }

  async function handleExcluirConta(conta: ContaPagar) {
    if (!window.confirm(`Excluir a conta "${labelCategoria(conta.categoria)}"?`)) return;
    try {
      await excluirContaPagar(conta.id);
      toast.success("Conta excluída.");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir.");
    }
  }

  async function handleDuplicarConta(conta: ContaPagar) {
    if (!usuario) return;
    try {
      await duplicarContaPagar(conta, usuario.id);
      toast.success("Conta duplicada para o mês seguinte.");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível duplicar.");
    }
  }

  async function handleExcluirBonificacao(bonificacao: Bonificacao) {
    if (!window.confirm(`Excluir a bonificação "${bonificacao.descricao}"?`)) return;
    try {
      await excluirBonificacao(bonificacao.id);
      toast.success("Bonificação excluída.");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir.");
    }
  }

  // ---- Cálculos ----

  const mesAtual = mesAtualChave();

  const comissoesDefinidas = comissoes.filter((c) => c.status === "definida");

  const receitaDoMes = comissoesDefinidas
    .filter((c) => c.criado_em?.slice(0, 7) === mesAtual)
    .reduce((soma, c) => soma + (c.valor_comissao_imobiliaria ?? 0), 0);

  const contasPagasDoMes = contas.filter((c) => c.status === "pago" && c.pago_em?.slice(0, 7) === mesAtual);
  const comissoesPagasDoMes = comissoesDefinidas.filter((c) => c.pago && c.pago_em?.slice(0, 7) === mesAtual);
  const bonificacoesDoMes = bonificacoes.filter((b) => b.data_pagamento?.slice(0, 7) === mesAtual);

  const despesasDoMes =
    contasPagasDoMes.reduce((soma, c) => soma + c.valor, 0) +
    comissoesPagasDoMes.reduce((soma, c) => soma + (c.valor_comissao_corretor ?? 0), 0) +
    bonificacoesDoMes.reduce((soma, b) => soma + b.valor, 0);

  const saldoDoMes = receitaDoMes - despesasDoMes;

  // Série dos últimos 6 meses (receita x despesa)
  const serieMensal = useMemo(() => {
    const mapa = new Map<string, { mes: string; receita: number; despesa: number }>();

    comissoesDefinidas.forEach((c) => {
      if (!c.criado_em) return;
      const chave = chaveMes(c.criado_em);
      if (!mapa.has(chave)) mapa.set(chave, { mes: chave, receita: 0, despesa: 0 });
      mapa.get(chave)!.receita += c.valor_comissao_imobiliaria ?? 0;
    });

    contas
      .filter((c) => c.status === "pago" && c.pago_em)
      .forEach((c) => {
        const chave = chaveMes(c.pago_em!);
        if (!mapa.has(chave)) mapa.set(chave, { mes: chave, receita: 0, despesa: 0 });
        mapa.get(chave)!.despesa += c.valor;
      });

    comissoesDefinidas
      .filter((c) => c.pago && c.pago_em)
      .forEach((c) => {
        const chave = chaveMes(c.pago_em!);
        if (!mapa.has(chave)) mapa.set(chave, { mes: chave, receita: 0, despesa: 0 });
        mapa.get(chave)!.despesa += c.valor_comissao_corretor ?? 0;
      });

    bonificacoes.forEach((b) => {
      const chave = chaveMes(b.data_pagamento);
      if (!mapa.has(chave)) mapa.set(chave, { mes: chave, receita: 0, despesa: 0 });
      mapa.get(chave)!.despesa += b.valor;
    });

    return Array.from(mapa.values()).slice(-6);
  }, [comissoesDefinidas, contas, bonificacoes]);

  // Despesas do mês por categoria (pra saber onde o dinheiro está indo)
  const despesasPorCategoria = useMemo(() => {
    const linhas: { label: string; valor: number }[] = [];

    const porCategoria = new Map<string, number>();
    contasPagasDoMes.forEach((c) => {
      porCategoria.set(c.categoria, (porCategoria.get(c.categoria) ?? 0) + c.valor);
    });
    porCategoria.forEach((valor, categoria) => {
      linhas.push({ label: labelCategoria(categoria as any), valor });
    });

    const totalComissoes = comissoesPagasDoMes.reduce((s, c) => s + (c.valor_comissao_corretor ?? 0), 0);
    if (totalComissoes > 0) linhas.push({ label: "Comissões pagas", valor: totalComissoes });

    const totalBonificacoes = bonificacoesDoMes.reduce((s, b) => s + b.valor, 0);
    if (totalBonificacoes > 0) linhas.push({ label: "Bonificações", valor: totalBonificacoes });

    return linhas.sort((a, b) => b.valor - a.valor);
  }, [contasPagasDoMes, comissoesPagasDoMes, bonificacoesDoMes]);

  const maiorDespesa = Math.max(1, ...despesasPorCategoria.map((d) => d.valor));

  if (loading) {
    return <p className="font-sans text-slate-400">Carregando...</p>;
  }

  return (
    <div className="space-y-6">

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <TrendingUp size={16} className="text-emerald-600" />
            Receita do mês
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {formatarPreco(receitaDoMes)}
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-400">Comissão da imobiliária</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <TrendingDown size={16} className="text-red-500" />
            Despesas do mês
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-red-500">
            {formatarPreco(despesasDoMes)}
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-400">Contas + comissões pagas + bonificações</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <Wallet size={16} className="text-gold" />
            Saldo do mês
          </p>
          <h2 className={`mt-2 font-display text-2xl font-bold ${saldoDoMes >= 0 ? "text-navy" : "text-red-500"}`}>
            {formatarPreco(saldoDoMes)}
          </h2>
        </div>

      </div>

      {/* Gráfico Receita x Despesa */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold text-navy">Receita x Despesa por mês</h2>

        {serieMensal.length === 0 ? (
          <p className="mt-6 font-sans text-slate-400">
            Ainda não há dados suficientes pra montar o gráfico.
          </p>
        ) : (
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serieMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(valor) => formatarPreco(Number(valor))} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="despesa" name="Despesa" fill="#EF4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Despesas por categoria */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-xl font-bold text-navy">Pra onde foi o dinheiro (mês atual)</h2>

        {despesasPorCategoria.length === 0 ? (
          <p className="mt-6 font-sans text-slate-400">Nenhuma despesa paga neste mês ainda.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {despesasPorCategoria.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between font-sans text-sm">
                  <span className="text-navy">{item.label}</span>
                  <span className="font-semibold text-slate-600">{formatarPreco(item.valor)}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${(item.valor / maiorDespesa) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contas a pagar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">Contas a pagar</h2>
          <button
            onClick={() => setModalContaAberto(true)}
            className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-gold-dark"
          >
            <Plus size={16} />
            Nova conta
          </button>
        </div>

        {contas.length === 0 ? (
          <p className="mt-6 font-sans text-slate-400">Nenhuma conta cadastrada ainda.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[640px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Categoria</th>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Descrição</th>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Valor</th>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Vencimento</th>
                  <th className="px-5 py-3 text-center font-sans text-sm text-slate-500">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {contas.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-sans text-navy">{labelCategoria(c.categoria)}</td>
                    <td className="px-5 py-3 font-sans text-slate-500">{c.descricao ?? "—"}</td>
                    <td className="px-5 py-3 font-sans text-navy">{formatarPreco(c.valor)}</td>
                    <td className="px-5 py-3 font-sans text-slate-500">
                      {c.vencimento ? new Date(c.vencimento).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleTogglePaga(c)}
                        className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${
                          c.status === "pago"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.status === "pago" ? "Pago" : "Pendente"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleDuplicarConta(c)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                          title="Duplicar pro mês seguinte"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleExcluirConta(c)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bonificações */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">Bonificações e premiações</h2>
          <button
            onClick={() => setModalBonificacaoAberto(true)}
            className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-gold-dark"
          >
            <Plus size={16} />
            Nova bonificação
          </button>
        </div>

        {bonificacoes.length === 0 ? (
          <p className="mt-6 font-sans text-slate-400">Nenhuma bonificação registrada ainda.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[560px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Corretor</th>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Descrição</th>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Valor</th>
                  <th className="px-5 py-3 text-left font-sans text-sm text-slate-500">Data</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {bonificacoes.map((b) => (
                  <tr key={b.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-sans text-navy">{b.corretor?.nome ?? "—"}</td>
                    <td className="px-5 py-3 font-sans text-slate-500">{b.descricao}</td>
                    <td className="px-5 py-3 font-sans font-semibold text-gold-dark">{formatarPreco(b.valor)}</td>
                    <td className="px-5 py-3 font-sans text-slate-500">
                      {new Date(b.data_pagamento).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleExcluirBonificacao(b)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NovaContaPagarModal
        open={modalContaAberto}
        onClose={() => setModalContaAberto(false)}
        onSaved={carregar}
        usuarioId={usuario?.id ?? ""}
      />

      <NovaBonificacaoModal
        open={modalBonificacaoAberto}
        onClose={() => setModalBonificacaoAberto(false)}
        onSaved={carregar}
        corretores={corretores}
        usuarioId={usuario?.id ?? ""}
      />

    </div>
  );
}
