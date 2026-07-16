"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Oportunidade } from "../types/oportunidade";

interface Props {
  oportunidade: Oportunidade;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onEditar: (oportunidade: Oportunidade) => void;
  onExcluir: (oportunidade: Oportunidade) => void;
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
  onEditar,
  onExcluir,
}: Props) {
  const valor =
    formatarPreco(oportunidade.valor_previsto) ??
    formatarPreco(oportunidade.valor_interesse);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, oportunidade.id)}
      className="group cursor-grab rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans font-semibold text-navy">
          {oportunidade.titulo || "Sem título"}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2 py-1 font-sans text-xs font-semibold ${
            corPrioridade[oportunidade.prioridade] ??
            corPrioridade.Normal
          }`}
        >
          {oportunidade.prioridade}
        </span>
      </div>

      <p className="mt-2 font-sans text-sm text-slate-500">
        {oportunidade.pessoa?.nome ?? "Pessoa não identificada"}
      </p>

      {valor && (
        <p className="mt-2 font-sans text-sm font-semibold text-gold">
          {valor}
        </p>
      )}

      {oportunidade.previsao_fechamento && (
        <p className="mt-2 font-sans text-xs text-slate-400">
          Previsão:{" "}
          {new Date(
            oportunidade.previsao_fechamento
          ).toLocaleDateString("pt-BR")}
        </p>
      )}

      <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3 opacity-0 transition group-hover:opacity-100">

        <button
          onClick={() => onEditar(oportunidade)}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
          aria-label="Editar"
        >
          <Pencil size={14} />
        </button>

        <button
          onClick={() => onExcluir(oportunidade)}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Excluir"
        >
          <Trash2 size={14} />
        </button>

      </div>
    </div>
  );
}
