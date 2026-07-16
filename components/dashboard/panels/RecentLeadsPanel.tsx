"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import {
  LeadRecente,
  listarLeadsRecentes,
} from "@/features/dashboard/services/atividade.service";

function tempoRelativo(data: string) {
  const diffMs = Date.now() - new Date(data).getTime();
  const minutos = Math.floor(diffMs / 60000);

  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas}h`;

  const dias = Math.floor(horas / 24);
  return `há ${dias}d`;
}

export default function RecentLeadsPanel() {
  const [leads, setLeads] = useState<LeadRecente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarLeadsRecentes(4)
      .then(setLeads)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Users className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">
          Leads Recentes
        </h2>

      </div>

      <div className="space-y-4">

        {loading ? (

          <p className="text-sm text-slate-400">Carregando...</p>

        ) : leads.length === 0 ? (

          <p className="text-sm text-slate-400">
            Nenhum lead cadastrado ainda.
          </p>

        ) : (

          leads.map((lead) => (

            <div
              key={lead.id}
              className="rounded-xl border border-slate-100 p-4"
            >

              <p className="font-medium">
                {lead.nome}
              </p>

              <p className="text-sm text-slate-500">
                Novo lead • {tempoRelativo(lead.criadoEm)}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}
