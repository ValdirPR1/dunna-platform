"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/core/auth/useAuth";

function saudacaoPorHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardHero() {
  const { usuario } = useAuth();
  const primeiroNome = usuario?.nome?.trim().split(" ")[0] ?? "";
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
      .eq("perdido", false)
      .then(({ data }) => {
        const lista = data ?? [];
        setResumo({
          // "Leads" aqui é o total de oportunidades ativas (não só as
          // que estão literalmente na etapa "Novo Lead") — pro
          // corretor, esse número precisa bater com a base dele
          // inteira, não só com quem ainda não foi contatado.
          leads: lista.length,
          visitas: lista.filter((o: any) => o.etapa === "Visita").length,
          propostas: lista.filter((o: any) => o.etapa === "Proposta").length,
        });
      });

    return () => cancelAnimationFrame(quadro);
  }, []);

  return (
    <div
      className={`mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-700 ease-out sm:p-8 lg:p-10 ${
        visivel
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >

      <span className="rounded-full bg-[#C8A96A]/10 px-4 py-2 text-sm font-semibold text-[#B68B2C]">
        Centro de Operações
      </span>

      <h1 className="mt-5 break-words text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
        {saudacaoPorHorario()}
        {primeiroNome ? `, ${primeiroNome}` : ""} 👋
      </h1>

      <p className="mt-4 max-w-3xl text-base text-slate-500 sm:text-lg">
        Você tem
        <strong> {resumo.leads} leads </strong>
        na sua base,
        <strong> {resumo.visitas} visitas </strong>
        agendadas e
        <strong> {resumo.propostas} propostas </strong>
        pendentes.
      </p>

    </div>
  );
}
