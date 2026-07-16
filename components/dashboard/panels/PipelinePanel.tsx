"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign } from "lucide-react";
import { listarPipeline } from "@/features/dashboard/services/atividade.service";

export default function PipelinePanel() {
  const [etapas, setEtapas] = useState<{ nome: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarPipeline()
      .then(setEtapas)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <CircleDollarSign className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">
          Pipeline Comercial
        </h2>

      </div>

      <div className="space-y-4">

        {loading ? (

          <p className="text-sm text-slate-400">Carregando...</p>

        ) : (

          etapas.map((item) => (

            <div
              key={item.nome}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
            >

              <span className="font-medium">
                {item.nome}
              </span>

              <span className="rounded-full bg-[#C8A96A] px-3 py-1 text-sm font-bold text-white">
                {item.total}
              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}
