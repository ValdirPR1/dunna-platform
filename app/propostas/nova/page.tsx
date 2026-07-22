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

const OPCOES_1_A_4 = Array.from({ length: 4 }, (_, i) => i + 1);
const OPCOES_1_A_10 = Array.from({ length: 10 }, (_, i) => i + 1);
const OPCOES_1_A_100 = Array.from({ length: 100 }, (_, i) => i + 1);

export default function NovaPropostaPage() {
  const [form, setForm] = useState<PropostaFormData>({
    nomeProduto: "",
    unidade: "",
    bloco: "",
    proponente1: { ...PROPONENTE_VAZIO },
    temSegundoProponente: false,
    proponente2: { ...PROPONENTE_VAZIO },

    sinal: "",
    sinalData: "",

    temComplementoSinal: false,
    complementoSinal: "",
    complementoSinalParcelas: "1",
    complementoSinalData: "",

    mensais: "",
    mensaisParcelas: "1",
    mensaisData: "",

    temIntercaladas: false,
    intercaladas: "",
    intercaladasParcelas: "1",
    intercaladasPeriodo: "Semestral",
    intercaladasData: "",

    chaves: "",
    chavesData: "",

    financiamento: "",
    financiamentoData: "",

    totalProposta: "",

    observacoes: "",
    cidadeAssinatura: "",
    dataAssinatura: new Date().toISOString().split("T")[0],
    corretorResponsavel: "",
  });

  const [gerandoPDF, setGerandoPDF] = useState(false);

  // Recalcula o total automaticamente considerando as quantidades de parcelas
  useEffect(() => {
    const totalSinal = Number(form.sinal) || 0;

    const totalComplemento = form.temComplementoSinal
      ? (Number(form.complementoSinal) || 0) *
        (Number(form.complementoSinalParcelas) || 0)
      : 0;

    const totalMensais =
      (Number(form.mensais) || 0) * (Number(form.mensaisParcelas) || 0);

    const totalIntercaladas = form.temIntercaladas
      ? (Number(form.intercaladas) || 0) *
        (Number(form.intercaladasParcelas) || 0)
      : 0;

    const totalChaves = Number(form.chaves) || 0;
    const totalFinanciamento = Number(form.financiamento) || 0;

    const total =
      totalSinal +
      totalComplemento +
      totalMensais +
      totalIntercaladas +
      totalChaves +
      totalFinanciamento;

    setForm((prev) => ({ ...prev, totalProposta: String(total) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.sinal,
    form.temComplementoSinal,
    form.complementoSinal,
    form.complementoSinalParcelas,
    form.mensais,
    form.mensaisParcelas,
    form.temIntercaladas,
    form.intercaladas,
    form.intercaladasParcelas,
    form.chaves,
    form.financiamento,
  ]);

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

          <div className="mb-4">
            <label className={labelClass}>
              Nome do Produto (empreendimento/condomínio)
            </label>
            <input
              value={form.nomeProduto}
              onChange={(e) => atualizar("nomeProduto", e.target.value)}
              placeholder="Ex: Residencial Cais Eco"
              className={inputClass}
            />
          </div>

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

          <div className="space-y-6">

            {/* Sinal */}
            <div>
              <p className="mb-2 font-sans text-sm font-bold text-navy">
                Sinal
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Valor</label>
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
            </div>

            <hr className="border-slate-100" />

            {/* Complemento de sinal (opcional) */}
            <div>
              <label className="mb-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.temComplementoSinal}
                  onChange={(e) =>
                    atualizar("temComplementoSinal", e.target.checked)
                  }
                  className="h-5 w-5 accent-gold"
                />
                <span className="font-sans text-sm font-bold text-navy">
                  Complemento de sinal (opcional)
                </span>
              </label>

              {form.temComplementoSinal && (
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Valor da parcela</label>
                    <CampoMoeda
                      value={form.complementoSinal}
                      onChange={(v) => atualizar("complementoSinal", v)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Quantidade</label>
                    <select
                      value={form.complementoSinalParcelas}
                      onChange={(e) =>
                        atualizar("complementoSinalParcelas", e.target.value)
                      }
                      className={inputClass}
                    >
                      {OPCOES_1_A_4.map((n) => (
                        <option key={n} value={n}>
                          {n}x
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Data Pagamento</label>
                    <input
                      type="date"
                      value={form.complementoSinalData}
                      onChange={(e) =>
                        atualizar("complementoSinalData", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Parcelas mensais */}
            <div>
              <p className="mb-2 font-sans text-sm font-bold text-navy">
                Parcelas Mensais
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Valor da parcela</label>
                  <CampoMoeda
                    value={form.mensais}
                    onChange={(v) => atualizar("mensais", v)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Quantidade</label>
                  <select
                    value={form.mensaisParcelas}
                    onChange={(e) =>
                      atualizar("mensaisParcelas", e.target.value)
                    }
                    className={inputClass}
                  >
                    {OPCOES_1_A_100.map((n) => (
                      <option key={n} value={n}>
                        {n}x
                      </option>
                    ))}
                  </select>
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
            </div>

            <hr className="border-slate-100" />

            {/* Intercaladas (opcional) */}
            <div>
              <label className="mb-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.temIntercaladas}
                  onChange={(e) =>
                    atualizar("temIntercaladas", e.target.checked)
                  }
                  className="h-5 w-5 accent-gold"
                />
                <span className="font-sans text-sm font-bold text-navy">
                  Parcelas intercaladas (opcional)
                </span>
              </label>

              {form.temIntercaladas && (
                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <label className={labelClass}>Valor da parcela</label>
                    <CampoMoeda
                      value={form.intercaladas}
                      onChange={(v) => atualizar("intercaladas", v)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Quantidade</label>
                    <select
                      value={form.intercaladasParcelas}
                      onChange={(e) =>
                        atualizar("intercaladasParcelas", e.target.value)
                      }
                      className={inputClass}
                    >
                      {OPCOES_1_A_10.map((n) => (
                        <option key={n} value={n}>
                          {n}x
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Período</label>
                    <select
                      value={form.intercaladasPeriodo}
                      onChange={(e) =>
                        atualizar(
                          "intercaladasPeriodo",
                          e.target.value as "Semestral" | "Anual"
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
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
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Chaves */}
            <div>
              <p className="mb-2 font-sans text-sm font-bold text-navy">
                Chaves
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Valor</label>
                  <CampoMoeda
                    value={form.chaves}
                    onChange={(v) => atualizar("chaves", v)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Data Pagamento</label>
                  <input
                    type="date"
                    value={form.chavesData}
                    onChange={(e) => atualizar("chavesData", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Financiamento */}
            <div>
              <p className="mb-2 font-sans text-sm font-bold text-navy">
                Financiamento
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Valor</label>
                  <CampoMoeda
                    value={form.financiamento}
                    onChange={(v) => atualizar("financiamento", v)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Data Pagamento</label>
                  <input
                    type="date"
                    value={form.financiamentoData}
                    onChange={(e) =>
                      atualizar("financiamentoData", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
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
