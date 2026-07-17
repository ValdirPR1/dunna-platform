"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ImovelVisualizado,
  listarImoveisMaisVisualizados,
} from "@/features/dashboard/services/visualizacoes.service";

export default function ImoveisVisualizadosPanel() {
  const [dados, setDados] = useState<ImovelVisualizado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarImoveisMaisVisualizados(6)
      .then(setDados)
      .finally(() => setLoading(false));
  }, []);

  const dadosGrafico = dados.map((item) => ({
    nome:
      item.titulo.length > 22
        ? `${item.titulo.slice(0, 22)}...`
        : item.titulo,
    visualizacoes: item.totalVisualizacoes,
  }));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">
        <Eye className="text-[#C8A96A]" />
        <h2 className="text-xl font-semibold">
          Imóveis Mais Visualizados
        </h2>
      </div>

      {loading ? (

        <p className="text-sm text-slate-400">Carregando...</p>

      ) : dadosGrafico.length === 0 ? (

        <p className="text-sm text-slate-400">
          Ainda não há visualizações registradas no site.
        </p>

      ) : (

        <div className="h-72">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <YAxis
                dataKey="nome"
                type="category"
                stroke="#94a3b8"
                fontSize={12}
                width={150}
              />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
              <Bar
                dataKey="visualizacoes"
                fill="#C8A96A"
                radius={[0, 8, 8, 0]}
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
}
