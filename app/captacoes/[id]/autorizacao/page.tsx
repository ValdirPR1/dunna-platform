"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, FileDown } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CampoMoeda from "@/components/ui/form/CampoMoeda";
import { buscarCaptacao } from "@/features/captacoes/services/captacoes.service";
import {
  AUTORIZACAO_VENDA_VAZIA,
  AutorizacaoVendaFormData,
} from "@/features/contratos/types/autorizacaoVenda";
import { gerarAutorizacaoVendaPDF } from "@/features/contratos/pdf/gerarAutorizacaoVendaPDF";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-navy outline-none focus:border-gold";
const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function AutorizacaoVendaPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [form, setForm] = useState<AutorizacaoVendaFormData>({
    ...AUTORIZACAO_VENDA_VAZIA,
  });

  useEffect(() => {
    buscarCaptacao(id).then((c) => {
      if (!c) {
        toast.error("Captação não encontrada.");
        setLoading(false);
        return;
      }

      // Pré-preenche com o que já foi levantado na vistoria — o
      // corretor só confere e completa o que faltar (CPF/RG, se ainda
      // não tinha, e o percentual de comissão).
      setForm({
        ...AUTORIZACAO_VENDA_VAZIA,
        proprietarioNome: c.proprietario_nome ?? "",
        proprietarioCpf: c.proprietario_cpf ?? "",
        proprietarioRg: c.proprietario_rg ?? "",
        proprietarioTelefone: c.proprietario_telefone ?? "",
        proprietarioEmail: c.proprietario_email ?? "",
        imovelTipo: c.tipo ?? "Apartamento",
        imovelEndereco: c.endereco ?? "",
        imovelBairro: c.bairro ?? "",
        imovelCidade: c.cidade ?? "",
        imovelEstado: c.estado ?? "PE",
        valorPretendido: c.valor_pretendido ? String(c.valor_pretendido) : "",
      });
      setLoading(false);
    });
  }, [id]);

  function atualizar<K extends keyof AutorizacaoVendaFormData>(
    campo: K,
    valor: AutorizacaoVendaFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function gerarPDF() {
    if (!form.proprietarioNome) {
      toast.error("Preenche pelo menos o nome do proprietário.");
      return;
    }

    setGerando(true);
    try {
      await gerarAutorizacaoVendaPDF(form);
    } finally {
      setGerando(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <p className="font-sans text-slate-400">Carregando...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>

      <div className="mx-auto max-w-3xl pb-20">

        <Link
          href={`/captacoes/${id}/editar`}
          className="mb-4 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-slate-500 hover:text-navy"
        >
          <ArrowLeft size={15} />
          Voltar pra captação
        </Link>

        <h1 className="mb-2 font-display text-3xl font-bold text-navy">
          Autorização de Venda
        </h1>
        <p className="mb-8 font-sans text-slate-500">
          Confere os dados abaixo (já trazidos da captação) e gera o termo em PDF pro proprietário assinar.
        </p>

        {/* Proprietário */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Proprietário(a)
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Nome completo</label>
              <input
                value={form.proprietarioNome}
                onChange={(e) => atualizar("proprietarioNome", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Endereço</label>
              <input
                value={form.proprietarioEndereco}
                onChange={(e) => atualizar("proprietarioEndereco", e.target.value)}
                placeholder="Rua, número, bairro, cidade - UF"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <label className={labelClass}>CPF</label>
              <input
                value={form.proprietarioCpf}
                onChange={(e) => atualizar("proprietarioCpf", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>RG</label>
              <input
                value={form.proprietarioRg}
                onChange={(e) => atualizar("proprietarioRg", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Telefone</label>
              <input
                value={form.proprietarioTelefone}
                onChange={(e) => atualizar("proprietarioTelefone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={form.proprietarioEmail}
                onChange={(e) => atualizar("proprietarioEmail", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

        </div>

        {/* Imóvel */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Imóvel
          </h2>

          <div className="space-y-4">

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>Tipo</label>
                <select
                  value={form.imovelTipo}
                  onChange={(e) => atualizar("imovelTipo", e.target.value)}
                  className={inputClass}
                >
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  <option>Sala Comercial</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Bairro</label>
                <input
                  value={form.imovelBairro}
                  onChange={(e) => atualizar("imovelBairro", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Cidade - UF</label>
                <div className="flex gap-2">
                  <input
                    value={form.imovelCidade}
                    onChange={(e) => atualizar("imovelCidade", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    value={form.imovelEstado}
                    onChange={(e) => atualizar("imovelEstado", e.target.value)}
                    className={inputClass + " max-w-[70px]"}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Endereço completo</label>
              <input
                value={form.imovelEndereco}
                onChange={(e) => atualizar("imovelEndereco", e.target.value)}
                placeholder="Rua, número, complemento"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Matrícula (opcional)</label>
              <input
                value={form.imovelMatricula}
                onChange={(e) => atualizar("imovelMatricula", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Valor pretendido de venda</label>
                <CampoMoeda
                  value={form.valorPretendido}
                  onChange={(v) => atualizar("valorPretendido", v)}
                />
              </div>
              <div>
                <label className={labelClass}>% comissão de corretagem</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={form.percentualComissao}
                  onChange={(e) => atualizar("percentualComissao", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Observações */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Observações (opcional)
          </h2>

          <textarea
            value={form.observacoes}
            onChange={(e) => atualizar("observacoes", e.target.value)}
            rows={3}
            placeholder="Alguma condição combinada com o proprietário que não está nas cláusulas padrão"
            className={inputClass}
          />

        </div>

        {/* Assinatura e testemunhas */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Assinatura e Testemunhas
          </h2>

          <div className="space-y-4">

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Cidade da Assinatura</label>
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

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.testemunha1Nome}
                onChange={(e) => atualizar("testemunha1Nome", e.target.value)}
                placeholder="Testemunha 1 - Nome"
                className={inputClass}
              />
              <input
                value={form.testemunha1Cpf}
                onChange={(e) => atualizar("testemunha1Cpf", e.target.value)}
                placeholder="Testemunha 1 - CPF"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.testemunha2Nome}
                onChange={(e) => atualizar("testemunha2Nome", e.target.value)}
                placeholder="Testemunha 2 - Nome"
                className={inputClass}
              />
              <input
                value={form.testemunha2Cpf}
                onChange={(e) => atualizar("testemunha2Cpf", e.target.value)}
                placeholder="Testemunha 2 - CPF"
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
          {gerando ? "Gerando PDF..." : "Gerar Autorização em PDF"}
        </button>

      </div>

    </AppShell>
  );
}
