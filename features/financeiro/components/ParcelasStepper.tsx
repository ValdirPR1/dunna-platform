"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  valorTotal: number;
  feitas: number;
  total: number;
  corTexto: string;
  corFundo: string;
  rotuloFeito: string;
  rotuloPendente: string;
  onMudar: (novoValor: number) => void;
  ocupado?: boolean;
}

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Controle de "quantas parcelas já entraram/saíram de fato". Quando a
// comissão é à vista (1 parcela só) vira um botão único, igual ao
// Pago/Pendente que já existia antes — não muda a experiência do caso
// simples. Quando é parcelada, vira um contador com +/- pra marcar
// cada parcela conforme o dinheiro realmente circula, mostrando o
// valor proporcional já confirmado (não o total da comissão).
export default function ParcelasStepper({
  valorTotal,
  feitas,
  total,
  corTexto,
  corFundo,
  rotuloFeito,
  rotuloPendente,
  onMudar,
  ocupado = false,
}: Props) {
  const parcelas = total > 0 ? total : 1;
  const valorAtual = valorTotal * (Math.min(feitas, parcelas) / parcelas);
  const completo = feitas >= parcelas;

  if (parcelas <= 1) {
    return (
      <button
        type="button"
        disabled={ocupado}
        onClick={() => onMudar(completo ? 0 : 1)}
        className={`rounded-full px-3 py-1 font-sans text-xs font-semibold transition disabled:opacity-50 ${
          completo ? `${corFundo} ${corTexto}` : "bg-amber-100 text-amber-700"
        }`}
      >
        {completo ? rotuloFeito : rotuloPendente}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={ocupado || feitas <= 0}
        onClick={() => onMudar(Math.max(0, feitas - 1))}
        className="rounded-lg border border-slate-200 p-1 text-slate-400 transition hover:bg-slate-100 disabled:opacity-30"
        title="Desmarcar última parcela"
      >
        <Minus size={12} />
      </button>

      <span
        className={`whitespace-nowrap rounded-full px-3 py-1 font-sans text-xs font-semibold ${
          completo
            ? `${corFundo} ${corTexto}`
            : feitas > 0
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        {formatarPreco(valorAtual)} · {feitas}/{parcelas}
      </span>

      <button
        type="button"
        disabled={ocupado || feitas >= parcelas}
        onClick={() => onMudar(Math.min(parcelas, feitas + 1))}
        className="rounded-lg border border-slate-200 p-1 text-slate-400 transition hover:bg-slate-100 disabled:opacity-30"
        title="Marcar mais uma parcela"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
