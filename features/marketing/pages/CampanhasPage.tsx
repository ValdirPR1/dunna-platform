"use client";

import { useEffect, useState } from "react";
import { Megaphone, DollarSign, Users, MousePointerClick, Target } from "lucide-react";
import {
  CampanhaFacebook,
  listarCampanhas,
} from "../services/facebookAds.service";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}

function formatarNumero(valor: number) {
  return valor.toLocaleString("pt-BR");
}

const corStatus: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-slate-100 text-slate-500",
};

const labelStatus: Record<string, string> = {
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
};

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState<CampanhaFacebook[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarCampanhas()
      .then((resultado) => {
        setCampanhas(resultado.campanhas);
        if (resultado.erro) setErro(resultado.erro);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalGasto = campanhas.reduce((s, c) => s + c.gasto, 0);
  const totalAlcance = campanhas.reduce((s, c) => s + c.alcance, 0);
  const totalCliques = campanhas.reduce((s, c) => s + c.cliques, 0);
  const totalConversoes = campanhas.reduce((s, c) => s + c.conversoes, 0);

  return (
    <div>

      <div className="flex items-center gap-3">
        <Megaphone className="text-gold" size={28} />
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">
            Campanhas
          </h1>
          <p className="mt-1 font-sans text-slate-500">
            Métricas do Facebook Ads dos últimos 30 dias.
          </p>
        </div>
      </div>

      {erro && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 font-sans text-sm text-amber-700">
          ⚠️ {erro}
        </div>
      )}

      {!erro && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign size={16} />
                <p className="font-sans text-sm">Gasto total</p>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-navy">
                {formatarPreco(totalGasto)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Users size={16} />
                <p className="font-sans text-sm">Alcance</p>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-navy">
                {formatarNumero(totalAlcance)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <MousePointerClick size={16} />
                <p className="font-sans text-sm">Cliques</p>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-navy">
                {formatarNumero(totalCliques)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Target size={16} />
                <p className="font-sans text-sm">Conversões (aprox.)</p>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-gold">
                {formatarNumero(totalConversoes)}
              </p>
            </div>

          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="font-display text-xl font-bold text-navy">
              Campanhas
            </h2>

            {loading ? (

              <p className="mt-6 font-sans text-slate-400">Carregando...</p>

            ) : campanhas.length === 0 ? (

              <p className="mt-6 font-sans text-slate-400">
                Nenhuma campanha encontrada nos últimos 30 dias.
              </p>

            ) : (

              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">

                <table className="w-full min-w-[700px]">

                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left font-sans text-slate-500">Campanha</th>
                      <th className="px-5 py-4 text-center font-sans text-slate-500">Status</th>
                      <th className="px-5 py-4 text-left font-sans text-slate-500">Gasto</th>
                      <th className="px-5 py-4 text-left font-sans text-slate-500">Alcance</th>
                      <th className="px-5 py-4 text-left font-sans text-slate-500">Cliques</th>
                      <th className="px-5 py-4 text-left font-sans text-slate-500">CTR</th>
                      <th className="px-5 py-4 text-left font-sans text-slate-500">Conversões</th>
                    </tr>
                  </thead>

                  <tbody>

                    {campanhas.map((c) => (
                      <tr key={c.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-sans font-semibold text-navy">
                          {c.nome}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${
                              corStatus[c.status] ?? corStatus.PAUSED
                            }`}
                          >
                            {labelStatus[c.status] ?? c.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-sans text-navy">
                          {formatarPreco(c.gasto)}
                        </td>
                        <td className="px-5 py-4 font-sans text-slate-500">
                          {formatarNumero(c.alcance)}
                        </td>
                        <td className="px-5 py-4 font-sans text-slate-500">
                          {formatarNumero(c.cliques)}
                        </td>
                        <td className="px-5 py-4 font-sans text-slate-500">
                          {c.ctr.toFixed(2)}%
                        </td>
                        <td className="px-5 py-4 font-sans font-semibold text-gold">
                          {formatarNumero(c.conversoes)}
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>
        </>
      )}

    </div>
  );
}
