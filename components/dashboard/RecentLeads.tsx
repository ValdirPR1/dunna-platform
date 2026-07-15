"use client";

import {
  Phone,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";

const leads = [
  {
    nome: "João Pedro",
    regiao: "Porto de Galinhas",
    investimento: "R$ 1.450.000",
    prioridade: "VIP",
  },
  {
    nome: "Maria Fernanda",
    regiao: "Praia dos Carneiros",
    investimento: "R$ 980.000",
    prioridade: "Quente",
  },
  {
    nome: "Carlos Eduardo",
    regiao: "Muro Alto",
    investimento: "R$ 2.150.000",
    prioridade: "VIP",
  },
  {
    nome: "Amanda Costa",
    regiao: "Tamandaré",
    investimento: "R$ 820.000",
    prioridade: "Morno",
  },
];

export default function RecentLeads() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Últimos Leads
          </h2>

          <p className="text-sm text-zinc-500">
            Leads recebidos recentemente
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {leads.map((lead) => (

          <div
            key={lead.nome}
            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-800/40 p-5 transition hover:border-[#C8A96A]/30 hover:bg-zinc-800"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C8A96A] font-bold text-black">
                {lead.nome.charAt(0)}
              </div>

              <div>

                <h3 className="font-semibold text-white">
                  {lead.nome}
                </h3>

                <div className="mt-1 flex items-center gap-4 text-sm text-zinc-400">

                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {lead.regiao}
                  </span>

                  <span>
                    {lead.investimento}
                  </span>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  lead.prioridade === "VIP"
                    ? "bg-amber-500/20 text-amber-300"
                    : lead.prioridade === "Quente"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-sky-500/20 text-sky-300"
                }`}
              >
                {lead.prioridade}
              </span>

              <button className="flex items-center gap-2 rounded-xl bg-[#C8A96A] px-4 py-2 font-medium text-black transition hover:brightness-110">

                <Phone size={16} />

                Abrir CRM

                <ArrowRight size={16} />

              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-[#C8A96A]">

        <Star size={16} />

        A IA identificou 2 leads com alta probabilidade de conversão.

      </div>

    </div>
  );
}