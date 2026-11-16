"use client";

import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CampoMoeda from "@/components/ui/form/CampoMoeda";
import {
  CONTRATO_CORRETAGEM_VAZIO,
  ContratoCorretagemFormData,
} from "@/features/contratos/types/contratoCorretagem";
import { gerarContratoCorretagemPDF } from "@/features/contratos/pdf/gerarContratoCorretagemPDF";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-navy outline-none focus:border-gold";
const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-slate-500";

function mascararCnpj(valor: string) {
  const n = valor.replace(/\D/g, "").slice(0, 14);
  return n
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export default function ContratoCorretagemPage() {
  const [gerando, setGerando] = useState(false);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [form, setForm] = useState<ContratoCorretagemFormData>({
    ...CONTRATO_CORRETAGEM_VAZIO,
  });

  const pj = form.tipoCliente === "pj";

  useEffect(() => {
    listarCorretoresAtivos().then(setCorretores).catch(() => setCorretores([]));
  }, []);

  function atualizar<K extends keyof ContratoCorretagemFormData>(
    campo: K,
    valor: ContratoCorretagemFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleSelecionarCorretor(id: string) {
    const corretor = corretores.find((c) => c.id === id);
    if (!corretor) return;
    setForm((prev) => ({
      ...prev,
      corretorResponsavel: corretor.nome,
      corretorCreci: corretor.creci ?? "",
    }));
  }

  async function gerarPDF() {
    setGerando(true);
    try {
      await gerarContratoCorretagemPDF(form);
    } finally {
      setGerando(false);
    }
  }

  return (
    <AppShell>

      <div className="mx-auto max-w-3xl pb-20">

        <h1 className="mb-2 font-display text-3xl font-bold text-navy">
          Recibo de Corretagem
        </h1>
        <p className="mb-8 font-sans text-slate-500">
          Contrato de prestação de serviço de corretagem imobiliária + recibo de quitação da comissão.
          Preenche os dados abaixo e gera o documento em PDF no mesmo padrão dos outros documentos da Dunna.
        </p>

        {/* Cliente */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Cliente (contratante)
          </h2>

          <div className="mb-5 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(["pf", "pj"] as const).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => atualizar("tipoCliente", tipo)}
                className={`rounded-lg px-5 py-2.5 font-sans text-sm font-semibold transition ${
                  form.tipoCliente === tipo
                    ? "bg-navy text-white"
                    : "text-slate-500 hover:text-navy"
                }`}
              >
                {tipo === "pf" ? "Pessoa física (CPF)" : "Empresa / construtora (CNPJ)"}
              </button>
            ))}
          </div>

          <div className="space-y-4">

            <div>
              <label className={labelClass}>
                {pj ? "Razão social" : "Nome completo"}
              </label>
              <input
                value={form.clienteNome}
                onChange={(e) => atualizar("clienteNome", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>{pj ? "CNPJ" : "CPF"}</label>
                <input
                  value={pj ? form.clienteCnpj : form.clienteCpf}
                  onChange={(e) =>
                    pj
                      ? atualizar("clienteCnpj", mascararCnpj(e.target.value))
                      : atualizar("clienteCpf", e.target.value)
                  }
                  placeholder={pj ? "00.000.000/0000-00" : undefined}
                  inputMode={pj ? "numeric" : undefined}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  {pj ? "Endereço da sede" : "Endereço"}
                </label>
                <input
                  value={form.clienteEndereco}
                  onChange={(e) => atualizar("clienteEndereco", e.target.value)}
                  placeholder="Rua, número, bairro, cidade - UF, CEP"
                  className={inputClass}
                />
              </div>
            </div>

            {pj && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <p className="font-sans text-sm font-semibold text-navy">
                  Representante legal
                </p>
                <div>
                  <label className={labelClass}>Nome completo</label>
                  <input
                    value={form.representanteNome}
                    onChange={(e) => atualizar("representanteNome", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>CPF</label>
                    <input
                      value={form.representanteCpf}
                      onChange={(e) => atualizar("representanteCpf", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Cargo (opcional)</label>
                    <input
                      value={form.representanteCargo}
                      onChange={(e) => atualizar("representanteCargo", e.target.value)}
                      placeholder="Ex: sócio-administrador"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {!pj && (
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.temSegundoContratante}
                  onChange={(e) => atualizar("temSegundoContratante", e.target.checked)}
                  className="h-5 w-5 accent-gold"
                />
                <span className="font-sans text-navy">
                  Mais de um contratante (ex: casal)
                </span>
              </label>
            )}

            {!pj && form.temSegundoContratante && (
              <div className="grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>2º contratante — nome completo</label>
                  <input
                    value={form.segundoContratanteNome}
                    onChange={(e) => atualizar("segundoContratanteNome", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>2º contratante — CPF</label>
                  <input
                    value={form.segundoContratanteCpf}
                    onChange={(e) => atualizar("segundoContratanteCpf", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Imóvel e negócio */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Imóvel e Negócio
          </h2>

          <div className="space-y-4">

            <div>
              <label className={labelClass}>Imóvel vendido</label>
              <input
                value={form.imovelDescricao}
                onChange={(e) => atualizar("imovelDescricao", e.target.value)}
                placeholder="Ex: Apartamento nº 220, Edifício Greensea Essence, Tamandaré - PE"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Valor da venda</label>
                <CampoMoeda
                  value={form.valorVenda}
                  onChange={(v) => atualizar("valorVenda", v)}
                />
              </div>
              <div>
                <label className={labelClass}>Valor da corretagem (comissão)</label>
                <CampoMoeda
                  value={form.valorCorretagem}
                  onChange={(v) => atualizar("valorCorretagem", v)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Forma de pagamento da corretagem</label>
              <input
                value={form.formaPagamentoCorretagem}
                onChange={(e) => atualizar("formaPagamentoCorretagem", e.target.value)}
                placeholder="Ex: à vista, via transferência/Pix"
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={form.temPremiacao}
                onChange={(e) => atualizar("temPremiacao", e.target.checked)}
                className="h-5 w-5 accent-gold"
              />
              <span className="font-sans text-navy">
                Incluir premiação (concedida pela construtora)
              </span>
            </label>

            {form.temPremiacao && (
              <div className="grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Valor da premiação</label>
                  <CampoMoeda
                    value={form.premiacaoValor}
                    onChange={(v) => atualizar("premiacaoValor", v)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Motivo (opcional)</label>
                  <input
                    value={form.premiacaoDescricao}
                    onChange={(e) => atualizar("premiacaoDescricao", e.target.value)}
                    placeholder="Ex: campanha de vendas de outubro"
                    className={inputClass}
                  />
                </div>
                <p className="font-sans text-xs text-slate-400 md:col-span-2">
                  Se o recibo for só da premiação, deixe o valor da corretagem vazio.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Corretor responsável */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Corretor Responsável
          </h2>

          <div className="space-y-4">

            {corretores.length > 0 && (
              <div>
                <label className={labelClass}>Selecionar da lista (opcional)</label>
                <select
                  onChange={(e) => handleSelecionarCorretor(e.target.value)}
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>Escolha um corretor...</option>
                  {corretores.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Nome do corretor</label>
                <input
                  value={form.corretorResponsavel}
                  onChange={(e) => atualizar("corretorResponsavel", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>CRECI</label>
                <input
                  value={form.corretorCreci}
                  onChange={(e) => atualizar("corretorCreci", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Foro e assinatura */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Local e Data
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Cidade (assinatura e foro)</label>
              <input
                value={form.cidadeAssinatura}
                onChange={(e) => atualizar("cidadeAssinatura", e.target.value)}
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
          </div>

        </div>

        <button
          onClick={gerarPDF}
          disabled={gerando}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-5 font-sans text-lg font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
        >
          <FileDown size={20} />
          {gerando ? "Gerando PDF..." : "Gerar Recibo de Corretagem em PDF"}
        </button>

        <p className="mt-4 font-sans text-xs text-slate-400">
          Modelo padrão de uso geral — não substitui a análise de um advogado pra casos específicos.
        </p>

      </div>

    </AppShell>
  );
}
