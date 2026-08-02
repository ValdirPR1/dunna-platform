"use client";

import { useState } from "react";
import { ETAPAS, Etapa, Oportunidade } from "../types/oportunidade";
import OportunidadeCard from "./OportunidadeCard";

// Cor de cada etapa do funil — ajuda a bater o olho e saber onde as
// coisas estão sem precisar ler o texto de cada coluna. Segue uma
// progressão "fria → quente" até chegar no dourado da marca em
// Contrato (a etapa mais importante) e fecha em um tom de sucesso no
// Pós-venda.
const CORES_ETAPA: Record<Etapa, { coluna: string; titulo: string; contador: string }> = {
  "Novo Lead": {
    coluna: "bg-blue-50",
    titulo: "text-blue-700",
    contador: "bg-blue-100 text-blue-700",
  },
  "Qualificação": {
    coluna: "bg-emerald-50",
    titulo: "text-emerald-700",
    contador: "bg-emerald-100 text-emerald-700",
  },
  "Visita": {
    coluna: "bg-amber-50",
    titulo: "text-amber-700",
    contador: "bg-amber-100 text-amber-700",
  },
  "Proposta": {
    coluna: "bg-orange-50",
    titulo: "text-orange-700",
    contador: "bg-orange-100 text-orange-700",
  },
  "Reserva": {
    coluna: "bg-violet-50",
    titulo: "text-violet-700",
    contador: "bg-violet-100 text-violet-700",
  },
  "Contrato": {
    coluna: "bg-gold/10",
    titulo: "text-gold-dark",
    contador: "bg-gold/20 text-gold-dark",
  },
  "Pós-venda": {
    coluna: "bg-teal-50",
    titulo: "text-teal-700",
    contador: "bg-teal-100 text-teal-700",
  },
};

interface Props {
  oportunidades: Oportunidade[];
  onMover: (id: string, novaEtapa: Etapa) => void;
  onEditar: (oportunidade: Oportunidade) => void;
  onExcluir: (oportunidade: Oportunidade) => void;
  onVerHistorico?: (oportunidade: Oportunidade) => void;
  onVendaRealizada?: (oportunidade: Oportunidade) => void;
  onVendaPerdida?: (oportunidade: Oportunidade) => void;
}

export default function Kanban({
  oportunidades,
  onMover,
  onEditar,
  onExcluir,
  onVerHistorico,
  onVendaRealizada,
  onVendaPerdida,
}: Props) {
  const [colunaSobre, setColunaSobre] = useState<Etapa | null>(null);

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDrop(e: React.DragEvent, etapa: Etapa) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onMover(id, etapa);
    setColunaSobre(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6">
      {ETAPAS.map((etapa) => {
        const itens = oportunidades.filter((o) => o.etapa === etapa);

        const valorTotal = itens.reduce(
          (soma, o) => soma + (o.valor_previsto ?? o.valor_interesse ?? 0),
          0
        );

        const cor = CORES_ETAPA[etapa];

        return (
          <div
            key={etapa}
            onDragOver={(e) => {
              e.preventDefault();
              setColunaSobre(etapa);
            }}
            onDragLeave={() => setColunaSobre(null)}
            onDrop={(e) => handleDrop(e, etapa)}
            className={`w-72 shrink-0 rounded-2xl p-3 transition ${cor.coluna} ${
              colunaSobre === etapa ? "ring-2 ring-gold/60" : ""
            }`}
          >
            <div className="mb-1 flex items-center justify-between px-1">
              <h2 className={`font-sans text-sm font-bold ${cor.titulo}`}>
                {etapa}
              </h2>
              <span className={`rounded-full px-2 py-0.5 font-sans text-xs font-semibold ${cor.contador}`}>
                {itens.length}
              </span>
            </div>

            {valorTotal > 0 && (
              <p className="mb-3 px-1 font-sans text-xs text-slate-400">
                {valorTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 0,
                })}
              </p>
            )}

            <div className="flex flex-col gap-3">
              {itens.map((oportunidade) => (
                <OportunidadeCard
                  key={oportunidade.id}
                  oportunidade={oportunidade}
                  onDragStart={handleDragStart}
                  onEditar={onEditar}
                  onExcluir={onExcluir}
                  onVerHistorico={onVerHistorico}
                  onVendaRealizada={onVendaRealizada}
                  onVendaPerdida={onVendaPerdida}
                />
              ))}

              {itens.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center font-sans text-xs text-slate-400">
                  Arraste um card aqui
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
