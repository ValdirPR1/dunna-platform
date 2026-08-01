"use client";

import { useState } from "react";
import { ETAPAS, Etapa, Oportunidade } from "../types/oportunidade";
import OportunidadeCard from "./OportunidadeCard";

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

        return (
          <div
            key={etapa}
            onDragOver={(e) => {
              e.preventDefault();
              setColunaSobre(etapa);
            }}
            onDragLeave={() => setColunaSobre(null)}
            onDrop={(e) => handleDrop(e, etapa)}
            className={`w-72 shrink-0 rounded-2xl p-3 transition ${
              colunaSobre === etapa ? "bg-gold/10" : "bg-slate-50"
            }`}
          >
            <div className="mb-1 flex items-center justify-between px-1">
              <h2 className="font-sans text-sm font-bold text-navy">
                {etapa}
              </h2>
              <span className="font-sans text-xs font-semibold text-slate-400">
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
