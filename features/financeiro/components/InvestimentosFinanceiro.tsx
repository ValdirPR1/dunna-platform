"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, X, Wallet, PiggyBank, TrendingUp } from "lucide-react";
import CampoValorMoeda from "@/components/ui/CampoValorMoeda";
import { useAuth } from "@/features/core/auth/useAuth";
import { listarComissoes } from "../services/comissoes.service";
import { listarContasPagar } from "../services/contasPagar.service";
import { listarBonificacoes } from "../services/bonificacoes.service";
import { obterSaldoInicialCaixa, calcularCaixa } from "../services/caixa.service";
import {
  listarInvestimentos,
  listarMovimentosInvestimento,
  criarInvestimento,
  registrarMovimento,
  atualizarValorInvestimento,
  excluirMovimentoInvestimento,
  excluirInvestimento,
  resumirInvestimento,
} from "../services/investimentos.service";
import {
  Investimento,
  MovimentoInvestimento,
  TipoMovimentoInvestimento,
} from "../types/investimento";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatarData(dataISO: string) {
  const [ano, mes, dia] = dataISO.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

type ModalState =
  | { tipo: "novo" }
  | { tipo: "movimento"; investimento: Investimento; movimento: TipoMovimentoInvestimento }
  | { tipo: "valor"; investimento: Investimento }
  | null;

export default function InvestimentosFinanceiro() {
  const { usuario } = useAuth();
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [movimentos, setMovimentos] = useState<MovimentoInvestimento[]>([]);
  const [saldoCaixa, setSaldoCaixa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  // Campos dos modais
  const [nome, setNome] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hoje());
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const [inv, mov, comissoes, contas, bonificacoes, saldoInicial] =
        await Promise.all([
          listarInvestimentos(),
          listarMovimentosInvestimento(),
          listarComissoes(),
          listarContasPagar(),
          listarBonificacoes(),
          obterSaldoInicialCaixa(),
        ]);
      setInvestimentos(inv);
      setMovimentos(mov);
      setSaldoCaixa(
        calcularCaixa({
          saldoInicial,
          comissoes,
          contas,
          bonificacoes,
          movimentos: mov,
        }).saldo
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirModal(novo: ModalState) {
    setNome("");
    setInstituicao("");
    setValor(novo?.tipo === "valor" ? String(Math.round(novo.investimento.valor_atual)) : "");
    setData(hoje());
    setDescricao("");
    setModal(novo);
  }

  async function handleSalvar() {
    if (!modal || !usuario) return;
    setSalvando(true);
    try {
      if (modal.tipo === "novo") {
        if (!nome.trim()) {
          toast.error("Dê um nome ao investimento.");
          return;
        }
        await criarInvestimento({ nome, instituicao }, usuario.id);
        toast.success("Investimento criado.");
      } else if (modal.tipo === "movimento") {
        const v = Number(valor);
        if (!v || v <= 0) {
          toast.error("Informe o valor.");
          return;
        }
        await registrarMovimento(
          modal.investimento,
          { tipo: modal.movimento, valor: v, data, descricao },
          usuario.id
        );
        toast.success(
          modal.movimento === "aplicacao" ? "Aplicação registrada." : "Resgate registrado."
        );
      } else {
        await atualizarValorInvestimento(modal.investimento.id, Number(valor) || 0);
        toast.success("Valor atualizado.");
      }
      setModal(null);
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluirInvestimento(inv: Investimento) {
    if (
      !window.confirm(
        `Excluir "${inv.nome}" e todo o histórico dele? O dinheiro aplicado volta a contar como caixa.`
      )
    )
      return;
    try {
      await excluirInvestimento(inv.id);
      toast.success("Investimento excluído.");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir.");
    }
  }

  async function handleExcluirMovimento(m: MovimentoInvestimento) {
    if (!window.confirm("Excluir esse movimento? O valor do investimento não é ajustado automaticamente."))
      return;
    try {
      await excluirMovimentoInvestimento(m.id);
      toast.success("Movimento excluído.");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir.");
    }
  }

  if (loading) return <p className="font-sans text-slate-400">Carregando...</p>;

  const totalInvestido = investimentos.reduce((s, i) => s + i.valor_atual, 0);
  const rendimentoTotal = investimentos.reduce(
    (s, i) => s + resumirInvestimento(i, movimentos).rendimento,
    0
  );

  const titulosModal: Record<string, string> = {
    novo: "Novo investimento",
    aplicacao: "Aplicar dinheiro",
    resgate: "Resgatar dinheiro",
    valor: "Atualizar valor atual",
  };
  const tituloModal = modal
    ? modal.tipo === "movimento"
      ? titulosModal[modal.movimento]
      : titulosModal[modal.tipo]
    : "";

  return (
    <div className="space-y-6">

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <Wallet size={16} className="text-gold" />
            Disponível em caixa
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy">
            {formatarPreco(saldoCaixa)}
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-400">Pra gastos do dia a dia</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <PiggyBank size={16} className="text-gold" />
            Total investido
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy">
            {formatarPreco(totalInvestido)}
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-400">Valor atual das aplicações</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <TrendingUp size={16} className="text-emerald-600" />
            Rendimento
          </p>
          <h2
            className={`mt-2 font-display text-2xl font-bold ${
              rendimentoTotal >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {formatarPreco(rendimentoTotal)}
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-400">Valor atual + resgatado - aplicado</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-navy">Meus investimentos</h2>
        <button
          onClick={() => abrirModal({ tipo: "novo" })}
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-gold-dark"
        >
          <Plus size={16} />
          Novo investimento
        </button>
      </div>

      {investimentos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <p className="font-sans text-slate-500">
            Nenhum investimento ainda. Crie um (ex: CDB, Tesouro) e aplique dinheiro do caixa nele.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {investimentos.map((inv) => {
            const resumo = resumirInvestimento(inv, movimentos);
            const historico = movimentos.filter((m) => m.investimento_id === inv.id);

            return (
              <div key={inv.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-sans font-semibold text-navy">{inv.nome}</p>
                    {inv.instituicao && (
                      <p className="font-sans text-sm text-slate-500">{inv.instituicao}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleExcluirInvestimento(inv)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="mt-4 font-display text-2xl font-bold text-navy">
                  {formatarPreco(inv.valor_atual)}
                </p>
                <p className="font-sans text-xs text-slate-500">
                  Aplicado {formatarPreco(resumo.aplicado)}
                  {resumo.resgatado > 0 && ` · Resgatado ${formatarPreco(resumo.resgatado)}`} ·{" "}
                  <span className={resumo.rendimento >= 0 ? "text-emerald-600" : "text-red-500"}>
                    Rendimento {formatarPreco(resumo.rendimento)}
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => abrirModal({ tipo: "movimento", investimento: inv, movimento: "aplicacao" })}
                    className="rounded-full bg-emerald-100 px-4 py-1.5 font-sans text-xs font-semibold text-emerald-700 hover:bg-emerald-200"
                  >
                    Aplicar
                  </button>
                  <button
                    onClick={() => abrirModal({ tipo: "movimento", investimento: inv, movimento: "resgate" })}
                    className="rounded-full bg-slate-100 px-4 py-1.5 font-sans text-xs font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    Resgatar
                  </button>
                  <button
                    onClick={() => abrirModal({ tipo: "valor", investimento: inv })}
                    className="rounded-full bg-slate-100 px-4 py-1.5 font-sans text-xs font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    Atualizar valor
                  </button>
                </div>

                {historico.length > 0 && (
                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
                    {historico.map((m) => (
                      <div key={m.id} className="flex items-center justify-between font-sans text-xs text-slate-500">
                        <span>
                          {formatarData(m.data)} · {m.tipo === "aplicacao" ? "Aplicação" : "Resgate"}
                          {m.descricao ? ` · ${m.descricao}` : ""}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className={m.tipo === "aplicacao" ? "text-slate-700" : "text-emerald-600"}>
                            {m.tipo === "aplicacao" ? "-" : "+"}
                            {formatarPreco(m.valor)}
                          </span>
                          <button
                            onClick={() => handleExcluirMovimento(m)}
                            className="text-slate-300 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy">{tituloModal}</h2>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {modal.tipo === "novo" && (
                <>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome (ex: CDB 110% CDI)"
                    className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
                  />
                  <input
                    value={instituicao}
                    onChange={(e) => setInstituicao(e.target.value)}
                    placeholder="Banco / corretora (opcional)"
                    className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
                  />
                </>
              )}

              {modal.tipo !== "novo" && (
                <div>
                  <label className="mb-1 block font-sans text-sm font-medium text-navy">
                    {modal.tipo === "valor" ? "Valor atual do investimento" : "Valor"}
                  </label>
                  <CampoValorMoeda value={valor} onChange={setValor} autoFocus />
                </div>
              )}

              {modal.tipo === "movimento" && (
                <>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
                  />
                  <input
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Observação (opcional)"
                    className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
                  />
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModal(null)}
                className="rounded-xl px-5 py-3 font-sans font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                disabled={salvando}
                className="rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
