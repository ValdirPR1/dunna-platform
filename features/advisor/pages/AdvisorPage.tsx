"use client";

import { useEffect, useState } from "react";
import {
  Home,
  DollarSign,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  CategoriaInsight,
  Insight,
  LABEL_CATEGORIA,
  gerarInsights,
} from "../services/advisor.service";

const iconePorCategoria: Record<CategoriaInsight, any> = {
  captacao: Home,
  preco: DollarSign,
  cliente: Users,
  gestao: BarChart3,
};

const corPrioridade: Record<string, string> = {
  alta: "border-red-200 bg-red-50",
  media: "border-amber-200 bg-amber-50",
  baixa: "border-slate-200 bg-slate-50",
};

const badgePrioridade: Record<string, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-amber-100 text-amber-700",
  baixa: "bg-slate-200 text-slate-600",
};

export default function AdvisorPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<CategoriaInsight | "todos">("todos");

  useEffect(() => {
    gerarInsights()
      .then(setInsights)
      .finally(() => setLoading(false));
  }, []);

  const filtrados =
    filtro === "todos"
      ? insights
      : insights.filter((i) => i.categoria === filtro);

  const categorias: (CategoriaInsight | "todos")[] = [
    "todos",
    "captacao",
    "preco",
    "cliente",
    "gestao",
  ];

  return (
    <div>

      <div className="flex items-center gap-3">

        <Sparkles className="text-gold" size={28} />

        <div>
          <h1 className="font-display text-3xl font-bold text-navy">
            Advisor IA
          </h1>
          <p className="mt-1 font-sans text-slate-500">
            Recomendações geradas a partir dos dados reais do sistema.
          </p>
        </div>

      </div>

      <div className="mt-8 flex flex-wrap gap-2">

        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`rounded-xl px-5 py-2 font-sans text-sm font-semibold transition ${
              filtro === cat
                ? "bg-navy text-white"
                : "border border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {cat === "todos" ? "Todos" : LABEL_CATEGORIA[cat]}
          </button>
        ))}

      </div>

      <div className="mt-8">

        {loading ? (

          <p className="font-sans text-slate-400">Analisando os dados...</p>

        ) : filtrados.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <p className="font-sans text-slate-500">
              Nenhum alerta por aqui. Sistema saudável! ✅
            </p>
          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2">

            {filtrados.map((insight) => {
              const Icone = iconePorCategoria[insight.categoria];

              return (
                <div
                  key={insight.id}
                  className={`rounded-2xl border p-6 ${
                    corPrioridade[insight.prioridade]
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gold shadow-sm">
                        <Icone size={18} />
                      </div>

                      <div>
                        <p className="font-sans font-semibold text-navy">
                          {insight.titulo}
                        </p>
                        <p className="font-sans text-xs text-slate-500">
                          {LABEL_CATEGORIA[insight.categoria]}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${
                        badgePrioridade[insight.prioridade]
                      }`}
                    >
                      {insight.prioridade}
                    </span>

                  </div>

                  <p className="mt-4 font-sans text-sm text-slate-600">
                    {insight.mensagem}
                  </p>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}
