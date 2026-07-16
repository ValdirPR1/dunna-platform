"use client";

import { useOportunidades } from "@/features/crm/hooks/useOportunidades";
import Kanban from "@/features/crm/components/Kanban";

export default function CRMPage() {
  const { oportunidades, loading, moverParaEtapa } = useOportunidades();

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-slate-900">
        CRM
      </h1>

      <p className="mt-2 text-slate-500">
        Acompanhe as oportunidades do funil de vendas. Arraste os
        cards entre as colunas para mudar a etapa.
      </p>

      <div className="mt-8">
        {loading ? (
          <p className="text-slate-400">Carregando oportunidades...</p>
        ) : (
          <Kanban
            oportunidades={oportunidades}
            onMover={moverParaEtapa}
          />
        )}
      </div>

    </div>
  );
}
