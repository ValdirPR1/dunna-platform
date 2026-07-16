"use client";

import { Oportunidade } from "../types/oportunidade";

interface Props {
  oportunidade: Oportunidade;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

function formatarPreco(valor: number | null) {
  if (!valor) return null;
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

const corPrioridade: Record<string, string> = {
  Alta: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  Baixa: "bg-slate-100 text-slate-600",
};

export default function OportunidadeCard({
  oportunidade,
  onDragStart,
}: Props) {
  const valor =
    formatarPreco(oportunidade.valor_previsto) ??
    formatarPreco(oportunidade.valor_interesse);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, oportunidade.id)}
      className="cursor-grab rounded-2xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">
          {oportunidade.titulo || "Sem título"}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
            corPrioridade[oportunidade.prioridade] ??
            corPrioridade.Normal
          }`}
        >
          {oportunidade.prioridade}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {oportunidade.pessoa?.nome ?? "Pessoa não identificada"}
      </p>

      {valor && (
        <p className="mt-2 text-sm font-semibold text-[#C8A96A]">
          {valor}
        </p>
      )}

      {oportunidade.previsao_fechamento && (
        <p className="mt-2 text-xs text-slate-400">
          Previsão:{" "}
          {new Date(
            oportunidade.previsao_fechamento
          ).toLocaleDateString("pt-BR")}
        </p>
      )}
    </div>
  );
}
