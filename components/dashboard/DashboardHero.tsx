"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function saudacaoPorHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardHero() {
  const [visivel, setVisivel] = useState(false);
  const [resumo, setResumo] = useState({
    leads: 0,
    visitas: 0,
    propostas: 0,
  });

  useEffect(() => {
    // dispara a animação de entrada logo após montar
    const quadro = requestAnimationFrame(() => setVisivel(true));

    supabase
      .from("oportunidades")
      .select("etapa")
      .then(({ data }) => {
        const lista = data ?? [];
        setResumo({
          leads: lista.filter((o: any) => o.etapa === "Novo Lead").length,
          visitas: lista.filter((o: any) => o.etapa === "Visita").length,
          propostas: lista.filter((o: any) => o.etapa === "Proposta").length,
        });
      });

    return () => cancelAnimationFrame(quadro);
  }, []);

  return (
    <div
      className={`mb-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-700 ease-out ${
        visivel
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >

      <span className="rounded-full bg-[#C8A96A]/10 px-4 py-2 text-sm font-semibold text-[#B68B2C]">
        Centro de Operações
      </span>

      <h1 className="mt-5 text-5xl font-bold text-slate-900">
        {saudacaoPorHorario()}, Valdir 👋
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-slate-500">
        Hoje existem
        <strong> {resumo.leads} leads </strong>
        aguardando atendimento,
        <strong> {resumo.visitas} visitas </strong>
        agendadas e
        <strong> {resumo.propostas} propostas </strong>
        pendentes.
      </p>

    </div>
  );
}
