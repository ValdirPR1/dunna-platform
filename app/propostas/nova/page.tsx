"use client";

import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CamposProponente from "@/features/propostas/components/CamposProponente";
import CampoMoeda from "@/components/ui/form/CampoMoeda";
import {
  PropostaFormData,
  PROPONENTE_VAZIO,
  Proponente,
} from "@/features/propostas/types/proposta";
import { gerarPropostaPDF } from "@/features/propostas/pdf/gerarPropostaPDF";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-navy outline-none focus:border-gold";

const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function NovaPropostaPage() {
  const [form, setForm] = useState<PropostaFormData>({
    unidade: "",
    bloco: "",
    proponente1: { ...PROPONENTE_VAZIO },
    temSegundoProponente: false,
    proponente2: { ...PROPONENTE_VAZIO },
    sinal: "",
    sinalData: "",
    mensais: "",
    mensaisData: "",
    intercaladas: "",
    intercaladasData: "",
    chavesFinanciamento: "",
    chavesFinanciamentoData: "",
    totalProposta: "",
    observacoes: "",
    cidadeAssinatura: "",
    dataAssinatura: new Date().toISOString().split("T")[0],
    corretorResponsavel: "",
  });

  // Recalcula o total automaticamente com base nos 4 valores de pagamento
  useEffect(() => {
    const total =
      (Number(form.sinal) || 0) +
      (Number(form.mensais) || 0) +
      (Number(form.intercaladas) || 0) +
      (Number(form.chavesFinanciamento) || 0);

    setForm((prev) => ({ ...prev, totalProposta: String(total) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sinal, form.mensais, form.intercaladas, form.chavesFinanciamento]);

  function atualizar<K extends keyof PropostaFormData>(
    campo: K,
    valor: PropostaFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function atualizarProponente(
    qual: "proponente1" | "proponente2",
    campo: keyof Proponente,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      [qual]: { ...prev[qual], [campo]: valor },
    }));
  }

  const [gerandoPDF, setGerandoPDF] = useState(false);

  async function gerarPDF() {
    setGerandoPDF(true);
    try {
      await gerarPropostaPDF(form);
    } finally {
      setGerandoPDF(false);
    }
  }

  return (
    <AppShell>

      <div className="mx-auto max-w-3xl pb-20">

        <h1 className="mb-2 font-display text-3xl font-bold text-navy">
          Nova Proposta
        </h1>
        <p className="mb-8 font-sans text-slate-500">
          Preenche os dados abaixo e gera o PDF pra enviar pro vendedor.
        </p>

        {/* Produto */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Produto
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Unidade</label>
              <input
                value={form.unidade}
                onChange={(e) => atualizar("unidade", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Bloco</label>
              <input
                value={form.bloco}
                onChange={(e) => atualizar("bloco", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

        </div>

        {/* 1º Proponente */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            1º Proponente
          </h2>

          <CamposProponente
            dados={form.proponente1}
            onChange={(campo, valor) =>
              atualizarProponente("proponente1", campo, valor)
            }
          />

        </div>

        {/* 2º Proponente */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.temSegundoProponente}
              onChange={(e) =>
                atualizar("temSegundoProponente", e.target.checked)
              }
              className="h-5 w-5 accent-gold"
            />
            <span className="font-display text-lg font-bold text-navy">
              Adicionar 2º Comprador(a)
            </span>
          </label>

          {form.temSegundoProponente && (
            <div className="mt-5">
              <CamposProponente
                dados={form.proponente2}
                onChange={(campo, valor) =>
                  atualizarProponente("proponente2", campo, valor)
                }
              />
            </div>
          )}

        </div>

        {/* Fluxo de pagamento */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Fluxo de Pagamento
          </h2>

          <div className="space-y-4">

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Sinal</label>
                <CampoMoeda
                  value={form.sinal}
                  onChange={(v) => atualizar("sinal", v)}
                />
              </div>
              <div>
                <label className={labelClass}>Data Pagamento</label>
                <input
                  type="date"
                  value={form.sinalData}
                  onChange={(e) => atualizar("sinalData", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Mensais</label>
                <CampoMoeda
                  value={form.mensais}
                  onChange={(v) => atualizar("mensais", v)}
                />
              </div>
              <div>
                <label className={labelClass}>Data Pagamento</label>
                <input
                  type="date"
                  value={form.mensaisData}
                  onChange={(e) => atualizar("mensaisData", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>30 e 60 dias intercaladas</label>
                <CampoMoeda
                  value={form.intercaladas}
                  onChange={(v) => atualizar("intercaladas", v)}
                />
              </div>
              <div>
                <label className={labelClass}>Data Pagamento</label>
                <input
                  type="date"
                  value={form.intercaladasData}
                  onChange={(e) =>
                    atualizar("intercaladasData", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Chaves / Financiamento</label>
                <CampoMoeda
                  value={form.chavesFinanciamento}
                  onChange={(v) => atualizar("chavesFinanciamento", v)}
                />
              </div>
              <div>
                <label className={labelClass}>Data Pagamento</label>
                <input
                  type="date"
                  value={form.chavesFinanciamentoData}
                  onChange={(e) =>
                    atualizar("chavesFinanciamentoData", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-gold/10 p-5">
            <p className="font-sans text-sm text-slate-500">
              Total da proposta (calculado automaticamente)
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-gold">
              {form.totalProposta
                ? Number(form.totalProposta).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "R$ 0,00"}
            </p>
          </div>

        </div>

        {/* Observações */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className={labelClass}>Observações</label>
          <textarea
            value={form.observacoes}
            onChange={(e) => atualizar("observacoes", e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>

        {/* Assinatura */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Assinatura
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Cidade</label>
              <input
                value={form.cidadeAssinatura}
                onChange={(e) =>
                  atualizar("cidadeAssinatura", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Data</label>
              <input
                type="date"
                value={form.dataAssinatura}
                onChange={(e) => atualizar("dataAssinatura", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Corretor Responsável</label>
              <input
                value={form.corretorResponsavel}
                onChange={(e) =>
                  atualizar("corretorResponsavel", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

        </div>

        <button
          onClick={gerarPDF}
          disabled={gerandoPDF}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-5 font-sans text-lg font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
        >
          <FileDown size={20} />
          {gerandoPDF ? "Gerando PDF..." : "Gerar PDF da Proposta"}
        </button>

      </div>

    </AppShell>
  );
}
