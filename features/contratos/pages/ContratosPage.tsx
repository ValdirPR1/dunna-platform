"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload, FileCheck } from "lucide-react";
import {
  ContratoNegocio,
  STATUS_CONTRATO,
  listarContratos,
  salvarContrato,
  uploadArquivoContrato,
} from "../services/contratos.service";

function formatarPreco(valor: number | null) {
  if (!valor) return "—";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

const corStatus: Record<string, string> = {
  "Rascunho": "bg-slate-100 text-slate-600",
  "Enviado": "bg-amber-100 text-amber-700",
  "Assinado": "bg-emerald-100 text-emerald-700",
};

export default function ContratosPage() {
  const [contratos, setContratos] = useState<ContratoNegocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviandoArquivo, setEnviandoArquivo] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const dados = await listarContratos();
      setContratos(dados);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleStatus(item: ContratoNegocio, status: string) {
    try {
      await salvarContrato(item.oportunidadeId, { status });
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o status.");
    }
  }

  async function handleDataAssinatura(item: ContratoNegocio, data: string) {
    try {
      await salvarContrato(item.oportunidadeId, {
        data_assinatura: data || null,
      });
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a data.");
    }
  }

  async function handleValorFinal(item: ContratoNegocio, valor: string) {
    try {
      await salvarContrato(item.oportunidadeId, {
        valor_final: valor ? Number(valor) : null,
      });
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o valor.");
    }
  }

  async function handleUpload(item: ContratoNegocio, file: File) {
    setEnviandoArquivo(item.oportunidadeId);
    try {
      const url = await uploadArquivoContrato(item.oportunidadeId, file);
      await salvarContrato(item.oportunidadeId, { arquivo_url: url });
      toast.success("Contrato enviado!");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível enviar o arquivo.");
    } finally {
      setEnviandoArquivo(null);
    }
  }

  return (
    <div>

      <h1 className="font-display text-3xl font-bold text-navy">
        Contratos
      </h1>

      <p className="mt-2 font-sans text-slate-500">
        Status e documentos dos negócios fechados.
      </p>

      <div className="mt-8">

        {loading ? (

          <p className="font-sans text-slate-400">Carregando...</p>

        ) : contratos.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <p className="font-sans text-slate-500">
              Nenhum negócio fechado ainda.
            </p>
          </div>

        ) : (

          <div className="space-y-4">

            {contratos.map((item) => (

              <div
                key={item.oportunidadeId}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>
                    <p className="font-sans font-semibold text-navy">
                      {item.pessoaNome}
                    </p>
                    <p className="font-sans text-sm text-slate-500">
                      {item.titulo}
                      {item.corretorNome ? ` • ${item.corretorNome}` : ""}
                    </p>
                    <p className="mt-1 font-sans text-sm text-slate-400">
                      Valor negociado: {formatarPreco(item.valorNegociado)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1 font-sans text-xs font-semibold ${
                      corStatus[item.status] ?? corStatus["Rascunho"]
                    }`}
                  >
                    {item.status}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 md:grid-cols-4">

                  <div>
                    <label className="mb-1 block font-sans text-xs text-slate-400">
                      Status
                    </label>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatus(item, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 font-sans text-sm"
                    >
                      {STATUS_CONTRATO.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-sans text-xs text-slate-400">
                      Data assinatura
                    </label>
                    <input
                      type="date"
                      defaultValue={item.dataAssinatura ?? ""}
                      onBlur={(e) => handleDataAssinatura(item, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-sans text-xs text-slate-400">
                      Valor final (R$)
                    </label>
                    <input
                      type="number"
                      defaultValue={item.valorFinal ?? ""}
                      onBlur={(e) => handleValorFinal(item, e.target.value)}
                      placeholder={String(item.valorNegociado)}
                      className="w-full rounded-lg border border-slate-200 p-2 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-sans text-xs text-slate-400">
                      Documento
                    </label>

                    {item.arquivoUrl ? (
                      <a
                        href={item.arquivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2 font-sans text-sm text-emerald-700"
                      >
                        <FileCheck size={14} />
                        Ver arquivo
                      </a>
                    ) : (
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2 font-sans text-sm text-slate-500 hover:border-gold hover:text-gold">
                        <Upload size={14} />
                        {enviandoArquivo === item.oportunidadeId
                          ? "Enviando..."
                          : "Enviar PDF"}
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(item, file);
                          }}
                        />
                      </label>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
