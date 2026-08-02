"use client";

import { useState } from "react";
import { ETAPAS, Etapa, Oportunidade } from "../types/oportunidade";
import OportunidadeCard from "./OportunidadeCard";

// Cor de cada etapa do funil — uma faixa sólida no topo da coluna,
// bem chamativa, pra bater o olho e identificar o estágio na hora,
// sem precisar ler o texto. Segue uma progressão "fria → quente" até
// chegar no dourado da marca em Contrato (a etapa mais importante) e
// fecha em um tom de sucesso no Pós-venda.
const CORES_ETAPA: Record<Etapa, { faixa: string; coluna: string; contador: string }> = {
  "Novo Lead": {
    faixa: "bg-blue-600 text-white",
    coluna: "bg-blue-50/80 border border-blue-200",
    contador: "bg-white/25 text-white",
  },
  "Qualificação": {
    faixa: "bg-emerald-600 text-white",
    coluna: "bg-emerald-50/80 border border-emerald-200",
    contador: "bg-white/25 text-white",
  },
  "Visita": {
    faixa: "bg-amber-400 text-amber-950",
    coluna: "bg-amber-50/80 border border-amber-200",
    contador: "bg-black/10 text-amber-950",
  },
  "Proposta": {
    faixa: "bg-orange-500 text-white",
    coluna: "bg-orange-50/80 border border-orange-200",
    contador: "bg-white/25 text-white",
  },
  "Reserva": {
    faixa: "bg-violet-600 text-white",
    coluna: "bg-violet-50/80 border border-violet-200",
    contador: "bg-white/25 text-white",
  },
  "Contrato": {
    faixa: "bg-gold text-white",
    coluna: "bg-gold/10 border border-gold/40",
    contador: "bg-white/30 text-white",
  },
  "Pós-venda": {
    faixa: "bg-teal-600 text-white",
    coluna: "bg-teal-50/80 border border-teal-200",
    contador: "bg-white/25 text-white",
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
            className={`w-72 shrink-0 overflow-hidden rounded-2xl transition ${cor.coluna} ${
              colunaSobre === etapa ? "ring-2 ring-offset-2 ring-gold" : ""
            }`}
          >
            <div className={`flex items-center justify-between px-3 py-2.5 ${cor.faixa}`}>
              <h2 className="font-sans text-sm font-bold">
                {etapa}
              </h2>
              <span className={`rounded-full px-2 py-0.5 font-sans text-xs font-semibold ${cor.contador}`}>
                {itens.length}
              </span>
            </div>

            <div className="p-3">

              {valorTotal > 0 && (
                <p className="mb-3 px-1 font-sans text-xs text-slate-500">
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
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center font-sans text-xs text-slate-400">
                    Arraste um card aqui
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
