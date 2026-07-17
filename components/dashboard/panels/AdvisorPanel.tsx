"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import {
  Insight,
  gerarInsights,
} from "@/features/advisor/services/advisor.service";

export default function AdvisorPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gerarInsights()
      .then((dados) => setInsights(dados.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <TriangleAlert className="text-[#C8A96A]" />
          <h2 className="text-xl font-semibold">Advisor IA</h2>
        </div>

        <Link
          href="/advisor"
          className="font-sans text-sm text-gold hover:underline"
        >
          Ver tudo
        </Link>

      </div>

      <div className="space-y-4">

        {loading ? (

          <p className="text-sm text-slate-400">Analisando...</p>

        ) : insights.length === 0 ? (

          <p className="text-sm text-slate-400">
            Nenhum alerta no momento. Sistema saudável!
          </p>

        ) : (

          insights.map((item) => (

            <div key={item.id} className="rounded-2xl bg-amber-50 p-4">
              <p className="font-semibold">{item.titulo}</p>
              <p className="mt-1 text-sm text-slate-500">
                {item.mensagem}
              </p>
            </div>

          ))

        )}

      </div>

    </div>
  );
}
