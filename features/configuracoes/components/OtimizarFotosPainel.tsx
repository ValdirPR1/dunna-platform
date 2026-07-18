"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ImageDown, CheckCircle2 } from "lucide-react";
import {
  FotoParaOtimizar,
  listarTodasAsFotos,
  otimizarFoto,
} from "../services/otimizarFotos.service";
import { obterConfiguracoes } from "../services/configuracoes.service";

function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OtimizarFotosPainel() {
  const [rodando, setRodando] = useState(false);
  const [total, setTotal] = useState(0);
  const [processadas, setProcessadas] = useState(0);
  const [falhas, setFalhas] = useState(0);
  const [economiaTotal, setEconomiaTotal] = useState(0);
  const [concluido, setConcluido] = useState(false);

  async function iniciar() {
    const confirmar = window.confirm(
      "Isso vai baixar, comprimir e reenviar todas as fotos já cadastradas no sistema (imóveis, empreendimentos e plantas). Pode levar alguns minutos dependendo de quantas fotos existirem. Continuar?"
    );

    if (!confirmar) return;

    setRodando(true);
    setConcluido(false);
    setProcessadas(0);
    setFalhas(0);
    setEconomiaTotal(0);

    try {
      const config = await obterConfiguracoes();
      const comMarcaDagua = config.marca_dagua_ativa === "true";

      const fotos: FotoParaOtimizar[] = await listarTodasAsFotos();
      setTotal(fotos.length);

      for (const foto of fotos) {
        try {
          const resultado = await otimizarFoto(foto, comMarcaDagua);
          setEconomiaTotal((prev) => prev + resultado.economizado);
        } catch (error) {
          console.error("Erro ao otimizar foto", foto.id, error);
          setFalhas((prev) => prev + 1);
        } finally {
          setProcessadas((prev) => prev + 1);
        }
      }

      setConcluido(true);
      toast.success("Otimização concluída!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível concluir a otimização.");
    } finally {
      setRodando(false);
    }
  }

  return (
    <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center gap-3">
        <ImageDown className="text-gold" size={24} />
        <h2 className="font-display text-xl font-bold text-navy">
          Otimizar fotos já cadastradas
        </h2>
      </div>

      <p className="mt-3 font-sans text-sm text-slate-500">
        Baixa cada foto já cadastrada no sistema, comprime (e aplica a
        marca d'água, se estiver ativada em "Empresa") e substitui pela
        versão otimizada — sem precisar recadastrar nada.
      </p>

      {!rodando && !concluido && (
        <button
          onClick={iniciar}
          className="mt-6 rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          Iniciar Otimização
        </button>
      )}

      {rodando && (
        <div className="mt-6">

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{
                width: total > 0 ? `${(processadas / total) * 100}%` : "0%",
              }}
            />
          </div>

          <p className="mt-3 font-sans text-sm text-slate-500">
            Processando {processadas} de {total} fotos...
          </p>

        </div>
      )}

      {concluido && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={18} />
            <p className="font-sans font-semibold">
              Otimização concluída!
            </p>
          </div>

          <p className="mt-2 font-sans text-sm text-emerald-700">
            {processadas} fotos processadas, economia total de{" "}
            {formatarTamanho(economiaTotal)}.
            {falhas > 0 && ` (${falhas} não puderam ser processadas.)`}
          </p>

        </div>
      )}

    </div>
  );
}
