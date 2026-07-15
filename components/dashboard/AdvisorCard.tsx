"use client";

import {
  Bot,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  FileSignature,
  CircleAlert,
} from "lucide-react";

const insights = [
  {
    icon: Users,
    title: "18 novos leads",
    description: "7 aguardam primeiro contato.",
    color: "text-emerald-400",
  },
  {
    icon: FileSignature,
    title: "3 contratos",
    description: "Pendentes de assinatura.",
    color: "text-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Mercado aquecido",
    description: "Porto de Galinhas lidera as buscas.",
    color: "text-sky-400",
  },
  {
    icon: CircleAlert,
    title: "Atenção",
    description: "2 clientes VIP aguardam retorno.",
    color: "text-red-400",
  },
];

export default function AdvisorCard() {
  return (
    <div className="rounded-3xl border border-[#C8A96A]/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-7">

      {/* Cabeçalho */}

      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C8A96A] shadow-lg shadow-[#C8A96A]/20">

          <Bot size={30} className="text-black" />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            Conselheira IA
          </h2>

          <p className="text-sm text-zinc-500">
            Dunna Intelligence
          </p>

        </div>

      </div>

      {/* Saudação */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">

        <p className="text-lg text-white">

          Boa tarde, <span className="font-bold text-[#C8A96A]">Valdir</span> 👋

        </p>

        <p className="mt-2 text-sm text-zinc-400">
          Analisei os dados da plataforma e encontrei alguns pontos importantes para hoje.
        </p>

      </div>

      {/* Insights */}

      <div className="mt-6 space-y-3">

        {insights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl bg-zinc-800/40 p-4 transition hover:bg-zinc-800"
            >
              <div className="mt-1">

                <Icon
                  size={20}
                  className={item.color}
                />

              </div>

              <div>

                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-400">
                  {item.description}
                </p>

              </div>

            </div>
          );
        })}

      </div>

      {/* Sugestão */}

      <div className="mt-7 rounded-2xl border border-[#C8A96A]/20 bg-[#C8A96A]/5 p-5">

        <div className="flex items-center gap-2">

          <Sparkles
            size={18}
            className="text-[#C8A96A]"
          />

          <p className="font-semibold text-[#C8A96A]">
            Sugestão da IA
          </p>

        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-300">
          João Pedro demonstrou aumento de interesse nas últimas 24 horas.
          Recomendo um contato ainda hoje e apresentar oportunidades em
          Porto de Galinhas com alta rentabilidade.
        </p>

      </div>

      {/* Botão */}

      <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#C8A96A] py-4 text-lg font-semibold text-black transition hover:brightness-110">

        Conversar com a IA

        <ArrowRight size={20} />

      </button>

    </div>
  );
}