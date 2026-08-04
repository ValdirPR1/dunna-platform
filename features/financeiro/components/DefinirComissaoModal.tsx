"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { Comissao, FormaRecebimento } from "../types/comissao";
import { definirComissao } from "../services/comissoes.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  comissao: Comissao | null;
  usuarioId: string;
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DefinirComissaoModal({
  open,
  onClose,
  onSaved,
  comissao,
  usuarioId,
}: Props) {
  const [percentualImobiliaria, setPercentualImobiliaria] = useState("5");
  const [percentualCorretor, setPercentualCorretor] = useState("50");
  const [formaRecebimento, setFormaRecebimento] = useState<FormaRecebimento>("avista");
  const [parcelas, setParcelas] = useState("1");
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open && comissao) {
      setPercentualImobiliaria(comissao.percentual_imobiliaria?.toString() ?? "5");
      setPercentualCorretor(comissao.percentual_corretor?.toString() ?? "50");
      setFormaRecebimento(comissao.forma_recebimento ?? "avista");
      setParcelas(comissao.parcelas?.toString() ?? "1");
      setObservacoes(comissao.observacoes ?? "");
    }
  }, [open, comissao]);

  if (!open || !comissao) return null;

  const valorVenda = comissao.valor_venda ?? 0;
  const previewImobiliaria = valorVenda * (Number(percentualImobiliaria || 0) / 100);
  const previewCorretor = previewImobiliaria * (Number(percentualCorretor || 0) / 100);

  async function handleSalvar() {
    const pImob = Number(percentualImobiliaria);
    const pCorretor = Number(percentualCorretor);

    if (!pImob || pImob <= 0 || !pCorretor || pCorretor <= 0) {
      toast.error("Preencha os dois percentuais.");
      return;
    }

    setSalvando(true);
    try {
      await definirComissao(
        comissao!.id,
        valorVenda,
        {
          percentual_imobiliaria: pImob,
          percentual_corretor: pCorretor,
          forma_recebimento: formaRecebimento,
          parcelas: Number(parcelas) || 1,
          observacoes,
        },
        usuarioId
      );
      toast.success("Comissão definida.");
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a comissão.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">Definir comissão</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-5 font-sans text-sm text-slate-500">
          {comissao.oportunidade?.titulo} • Venda de {formatarMoeda(valorVenda)}
        </p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                % comissão da imobiliária
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={percentualImobiliaria}
                onChange={(e) => setPercentualImobiliaria(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                % do corretor sobre a comissão
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={percentualCorretor}
                onChange={(e) => setPercentualCorretor(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 font-sans text-sm">
            <p className="text-slate-500">
              Comissão da imobiliária: <span className="font-semibold text-navy">{formatarMoeda(previewImobiliaria)}</span>
            </p>
            <p className="mt-1 text-slate-500">
              Comissão do corretor: <span className="font-semibold text-gold-dark">{formatarMoeda(previewCorretor)}</span>
            </p>
          </div>

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">
              O corretor recebe...
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormaRecebimento("avista")}
                className={`flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm font-semibold transition ${
                  formaRecebimento === "avista"
                    ? "border-gold bg-gold/10 text-gold-dark"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                De uma vez
              </button>
              <button
                type="button"
                onClick={() => setFormaRecebimento("parcelado")}
                className={`flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm font-semibold transition ${
                  formaRecebimento === "parcelado"
                    ? "border-gold bg-gold/10 text-gold-dark"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Parcelado
              </button>
            </div>
          </div>

          {formaRecebimento === "parcelado" && (
            <div>
              <label className="mb-1 block font-sans text-sm font-medium text-navy">
                Em quantas parcelas
              </label>
              <input
                type="number"
                min={2}
                value={parcelas}
                onChange={(e) => setParcelas(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block font-sans text-sm font-medium text-navy">
              Observações (opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={2}
              placeholder="Ex: 1ª parcela em setembro"
              className="w-full rounded-xl border border-slate-200 p-3 font-sans outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-3 font-sans font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar comissão"}
          </button>
        </div>
      </div>
    </div>
  );
}
