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
  "Novo Lead": "#2563eb",
  "Qualificação": "#059669",
  "Visita": "#fbbf24",
  "Proposta": "#f97316",
  "Reserva": "#7c3aed",
  "Contrato": "#C8A96A",
  "Pós-venda": "#0d9488",
};

// Etapas com fundo claro precisam de texto escuro pra manter contraste.
const ETAPAS_TEXTO_ESCURO = new Set<Etapa>(["Visita"]);

// Medidas do desenho do funil (formato de cone, como um funil de
// vendas tradicional). O afunilamento é sempre suave e constante de
// cima pra baixo (não varia com a quantidade de cada etapa) — isso
// evita que o desenho fique com "barrigas" quando uma etapa tem mais
// leads que a anterior. A quantidade real de cada etapa aparece como
// número dentro da faixa, e o VGV/comissão ao lado.
const FUNIL_LARGURA = 176;
const FUNIL_ALTURA_FAIXA = 40;
const FUNIL_ESPACO_FAIXA = 4;
const FUNIL_ALTURA =
  ETAPAS.length * FUNIL_ALTURA_FAIXA + (ETAPAS.length - 1) * FUNIL_ESPACO_FAIXA;

// Largura (proporção de 0 a 1) da linha que separa a faixa "k" da
// faixa "k+1", contando do topo (k=0, 100% de largura) até a base
// (k=ETAPAS.length, quase um ponto).
function contornoFunil(k: number) {
  return 1 - (k / ETAPAS.length) * 0.94;
}

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

              <div className="flex gap-6">

                <svg
                  width={FUNIL_LARGURA}
                  height={FUNIL_ALTURA}
                  viewBox={`0 0 ${FUNIL_LARGURA} ${FUNIL_ALTURA}`}
                  className="shrink-0"
                >
                  {funil.linhas.map((linha, indice) => {
                    const y0 = indice * (FUNIL_ALTURA_FAIXA + FUNIL_ESPACO_FAIXA);
                    const y1 = y0 + FUNIL_ALTURA_FAIXA;
                    const larguraTopo = contornoFunil(indice) * FUNIL_LARGURA;
                    const larguraBase = contornoFunil(indice + 1) * FUNIL_LARGURA;
                    const cx = FUNIL_LARGURA / 2;

                    const pontos = [
                      [cx - larguraTopo / 2, y0],
                      [cx + larguraTopo / 2, y0],
                      [cx + larguraBase / 2, y1],
                      [cx - larguraBase / 2, y1],
                    ]
                      .map((ponto) => ponto.join(","))
                      .join(" ");

                    return (
                      <g key={linha.etapa}>
                        <polygon points={pontos} fill={CORES_ETAPA[linha.etapa]} />
                        <text
                          x={cx}
                          y={(y0 + y1) / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="13"
                          fontWeight="700"
                          fill={
                            ETAPAS_TEXTO_ESCURO.has(linha.etapa)
                              ? "#78350f"
                              : "#ffffff"
                          }
                        >
                          {linha.quantidade}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div
                  className="flex min-w-0 flex-1 flex-col"
                  style={{ gap: FUNIL_ESPACO_FAIXA }}
                >

                  {funil.linhas.map((linha) => (

                    <div
                      key={linha.etapa}
                      className="flex flex-col justify-center border-b border-slate-50 last:border-0"
                      style={{ height: FUNIL_ALTURA_FAIXA }}
                    >
                      <span className="text-xs font-semibold text-slate-700">
                        {linha.etapa}
                      </span>
                      <span className="truncate text-[11px] text-slate-400">
                        VGV {formatarMoeda(linha.vgv)} · comissão{" "}
                        {formatarMoeda(linha.comissao)}
                      </span>
                    </div>

                  ))}

                </div>

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
