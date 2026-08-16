"use client";

import { useEffect, useState } from "react";
import { Funnel } from "lucide-react";
import { listarOportunidades } from "@/features/crm/services/oportunidades.service";
import { ETAPAS, Etapa, Oportunidade } from "@/features/crm/types/oportunidade";
import { useAuth } from "@/features/core/auth/useAuth";

// Comissão média da Dunna por venda e o quanto disso fica com o
// corretor — usados só pra dar uma estimativa no funil, não é valor
// contratual (cada venda pode ter condições diferentes).
const TAXA_COMISSAO_MEDIA = 0.05;
const SPLIT_CORRETOR = 0.5;

// Mesmas cores de cada etapa usadas no Kanban do CRM, pra quem
// trabalha nas duas telas reconhecer a etapa pela cor na hora.
const CORES_ETAPA: Record<Etapa, string> = {
  "Novo Lead": "bg-blue-600 text-white",
  "Qualificação": "bg-emerald-600 text-white",
  "Visita": "bg-amber-400 text-amber-950",
  "Proposta": "bg-orange-500 text-white",
  "Reserva": "bg-violet-600 text-white",
  "Contrato": "bg-gold text-white",
  "Pós-venda": "bg-teal-600 text-white",
};

interface LinhaFunil {
  etapa: Etapa;
  quantidade: number;
  vgv: number;
  comissao: number;
}

interface FunilDeCorretor {
  corretorId: string;
  corretorNome: string;
  linhas: LinhaFunil[];
  vgvTotal: number;
  comissaoTotal: number;
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

// Soma o VGV de um grupo de oportunidades — mesma regra usada no
// Kanban: prioriza o valor da venda fechada, depois o valor previsto
// pelo corretor e por último o valor de interesse original do lead.
function montarFunil(oportunidades: Oportunidade[]): LinhaFunil[] {
  return ETAPAS.map((etapa) => {
    const itens = oportunidades.filter((o) => o.etapa === etapa);
    const vgv = itens.reduce(
      (soma, o) =>
        soma + (o.valor_venda || o.valor_previsto || o.valor_interesse || 0),
      0
    );

    return {
      etapa,
      quantidade: itens.length,
      vgv,
      comissao: vgv * TAXA_COMISSAO_MEDIA * SPLIT_CORRETOR,
    };
  });
}

export default function FunilComercialPanel() {
  const { usuario } = useAuth();
  const ehMaster = usuario?.papel === "master";

  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarOportunidades()
      .then(setOportunidades)
      .finally(() => setLoading(false));
  }, []);

  const base = ehMaster
    ? oportunidades
    : oportunidades.filter((o) => o.corretor_id === usuario?.corretor_id);

  const porCorretor = new Map<string, { nome: string; itens: Oportunidade[] }>();

  for (const o of base) {
    const id = o.corretor_id ?? "sem-corretor";
    const nome = o.corretor?.nome ?? "Sem corretor atribuído";
    if (!porCorretor.has(id)) porCorretor.set(id, { nome, itens: [] });
    porCorretor.get(id)!.itens.push(o);
  }

  const funis: FunilDeCorretor[] = Array.from(porCorretor.entries())
    .map(([corretorId, { nome, itens }]) => {
      const linhas = montarFunil(itens);
      return {
        corretorId,
        corretorNome: nome,
        linhas,
        vgvTotal: linhas.reduce((s, l) => s + l.vgv, 0),
        comissaoTotal: linhas.reduce((s, l) => s + l.comissao, 0),
      };
    })
    .sort((a, b) => b.vgvTotal - a.vgvTotal);

  const maiorQuantidade = Math.max(
    1,
    ...funis.flatMap((f) => f.linhas.map((l) => l.quantidade))
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Funnel className="text-[#C8A96A]" />

        <div>
          <h2 className="text-xl font-semibold">
            Funil Comercial
          </h2>
          <p className="text-sm text-slate-400">
            VGV e comissão estimada (5% por venda, 50% pro corretor) em
            cada etapa
          </p>
        </div>

      </div>

      {loading ? (

        <p className="text-sm text-slate-400">Carregando...</p>

      ) : funis.length === 0 ? (

        <p className="text-sm text-slate-400">
          Nenhuma oportunidade em aberto no momento.
        </p>

      ) : (

        <div className="flex flex-col gap-8">

          {funis.map((funil) => (

            <div key={funil.corretorId}>

              {ehMaster && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

                  <p className="font-semibold text-slate-800">
                    {funil.corretorNome}
                  </p>

                  <p className="text-sm text-slate-500">
                    VGV total:{" "}
                    <span className="font-semibold text-navy">
                      {formatarMoeda(funil.vgvTotal)}
                    </span>
                    {"  ·  "}
                    Comissão estimada:{" "}
                    <span className="font-semibold text-[#B68B2C]">
                      {formatarMoeda(funil.comissaoTotal)}
                    </span>
                  </p>

                </div>
              )}

              <div className="flex flex-col gap-2">

                {funil.linhas.map((linha) => {
                  const largura =
                    linha.quantidade === 0
                      ? 6
                      : Math.max(15, (linha.quantidade / maiorQuantidade) * 100);

                  return (

                    <div key={linha.etapa} className="flex items-center gap-4">

                      <div className="w-28 shrink-0 text-right font-sans text-xs font-semibold text-slate-500">
                        {linha.etapa}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 ${CORES_ETAPA[linha.etapa]}`}
                          style={{ width: `${largura}%`, minWidth: "170px" }}
                        >
                          <span className="text-sm font-bold">
                            {linha.quantidade}
                          </span>
                          <span className="whitespace-nowrap text-xs font-medium">
                            {formatarMoeda(linha.vgv)}
                          </span>
                        </div>
                      </div>

                      <div className="w-36 shrink-0 whitespace-nowrap font-sans text-xs text-slate-500">
                        comissão {formatarMoeda(linha.comissao)}
                      </div>

                    </div>

                  );
                })}

              </div>

              {!ehMaster && (
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-slate-100 pt-3 text-sm text-slate-500">
                  <span>
                    VGV total:{" "}
                    <span className="font-semibold text-navy">
                      {formatarMoeda(funil.vgvTotal)}
                    </span>
                  </span>
                  <span>
                    Comissão estimada:{" "}
                    <span className="font-semibold text-[#B68B2C]">
                      {formatarMoeda(funil.comissaoTotal)}
                    </span>
                  </span>
                </div>
              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
