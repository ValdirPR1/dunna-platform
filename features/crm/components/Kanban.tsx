"use client";

import { useState } from "react";
import { ETAPAS, Etapa, Oportunidade } from "../types/oportunidade";
import OportunidadeCard from "./OportunidadeCard";

interface Props {
  oportunidades: Oportunidade[];
  onMover: (id: string, novaEtapa: Etapa) => void;
}

export default function Kanban({ oportunidades, onMover }: Props) {
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
              colunaSobre === etapa ? "bg-[#C8A96A]/10" : "bg-slate-50"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-700">
                {etapa}
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {itens.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {itens.map((oportunidade) => (
                <OportunidadeCard
                  key={oportunidade.id}
                  oportunidade={oportunidade}
                  onDragStart={handleDragStart}
                />
              ))}

              {itens.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
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
