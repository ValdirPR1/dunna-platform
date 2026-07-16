"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import {
  AtividadeRecente,
  listarAtividadesRecentes,
} from "@/features/dashboard/services/atividade.service";

export default function ActivityPanel() {
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarAtividadesRecentes(6)
      .then(setAtividades)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Activity className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">
          Atividades Recentes
        </h2>

      </div>

      <div className="space-y-4">

        {loading ? (

          <p className="text-sm text-slate-400">Carregando...</p>

        ) : atividades.length === 0 ? (

          <p className="text-sm text-slate-400">
            Nenhuma atividade recente.
          </p>

        ) : (

          atividades.map((item) => (

            <div
              key={item.id}
              className="rounded-xl bg-slate-50 p-4"
            >

              {item.texto}

            </div>

          ))

        )}

      </div>

    </div>
  );
}
