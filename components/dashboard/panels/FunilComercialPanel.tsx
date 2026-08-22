"use client";

import { useEffect, useMemo, useState } from "react";
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
  totalLeads: number;
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

function montarFunilDeCorretor(
  corretorId: string,
  corretorNome: string,
  itens: Oportunidade[]
): FunilDeCorretor {
  const linhas = montarFunil(itens);
  return {
    corretorId,
    corretorNome,
    linhas,
    vgvTotal: linhas.reduce((s, l) => s + l.vgv, 0),
    comissaoTotal: linhas.reduce((s, l) => s + l.comissao, 0),
    totalLeads: itens.length,
  };
}

// Desenho do cone + lista de etapas — reaproveitado tanto pro funil
// geral quanto pro funil de um corretor específico.
function FunilVisual({ linhas }: { linhas: LinhaFunil[] }) {
  return (
    <div className="flex gap-6">

      <svg
        width={FUNIL_LARGURA}
        height={FUNIL_ALTURA}
        viewBox={`0 0 ${FUNIL_LARGURA} ${FUNIL_ALTURA}`}
        className="shrink-0"
      >
        {linhas.map((linha, indice) => {
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
                  ETAPAS_TEXTO_ESCURO.has(linha.etapa) ? "#78350f" : "#ffffff"
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

        {linhas.map((linha) => (

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
  );
}

function TotaisFunil({
  vgvTotal,
  comissaoTotal,
}: {
  vgvTotal: number;
  comissaoTotal: number;
}) {
  return (
    <p className="text-sm text-slate-500">
      VGV total:{" "}
      <span className="font-semibold text-navy">
        {formatarMoeda(vgvTotal)}
      </span>
      {"  ·  "}
      Comissão estimada:{" "}
      <span className="font-semibold text-[#B68B2C]">
        {formatarMoeda(comissaoTotal)}
      </span>
    </p>
  );
}

const ID_TODOS = "__todos__";

export default function FunilComercialPanel() {
  const { usuario } = useAuth();
  const ehMaster = usuario?.papel === "master";

  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [corretorSelecionado, setCorretorSelecionado] = useState(ID_TODOS);

  useEffect(() => {
    listarOportunidades()
      .then(setOportunidades)
      .finally(() => setLoading(false));
  }, []);

  const base = ehMaster
    ? oportunidades
    : oportunidades.filter((o) => o.corretor_id === usuario?.corretor_id);

  const funilGeral = useMemo(
    () => montarFunilDeCorretor(ID_TODOS, "Todos os corretores", base),
    [base]
  );

  const funisPorCorretor: FunilDeCorretor[] = useMemo(() => {
    const porCorretor = new Map<string, { nome: string; itens: Oportunidade[] }>();

    for (const o of base) {
      const id = o.corretor_id ?? "sem-corretor";
      const nome = o.corretor?.nome ?? "Sem corretor atribuído";
      if (!porCorretor.has(id)) porCorretor.set(id, { nome, itens: [] });
      porCorretor.get(id)!.itens.push(o);
    }

    return Array.from(porCorretor.entries())
      .map(([corretorId, { nome, itens }]) => montarFunilDeCorretor(corretorId, nome, itens))
      .sort((a, b) => b.vgvTotal - a.vgvTotal);
  }, [base]);

  const funilAtivo =
    ehMaster && corretorSelecionado !== ID_TODOS
      ? funisPorCorretor.find((f) => f.corretorId === corretorSelecionado) ?? funilGeral
      : ehMaster
      ? funilGeral
      : funisPorCorretor[0];

  const semOportunidades = base.length === 0;

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

      ) : semOportunidades ? (

        <p className="text-sm text-slate-400">
          Nenhuma oportunidade em aberto no momento.
        </p>

      ) : !funilAtivo ? null : (

        <div className="flex flex-col gap-5">

          <div>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

              <p className="font-semibold text-slate-800">
                {funilAtivo.corretorNome}
              </p>

              <TotaisFunil
                vgvTotal={funilAtivo.vgvTotal}
                comissaoTotal={funilAtivo.comissaoTotal}
              />

            </div>

            <FunilVisual linhas={funilAtivo.linhas} />

          </div>

          {ehMaster && funisPorCorretor.length > 1 && (

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">

              <button
                onClick={() => setCorretorSelecionado(ID_TODOS)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  corretorSelecionado === ID_TODOS
                    ? "bg-[#C8A96A] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>

              {funisPorCorretor.map((funil) => (
                <button
                  key={funil.corretorId}
                  onClick={() => setCorretorSelecionado(funil.corretorId)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    corretorSelecionado === funil.corretorId
                      ? "bg-[#C8A96A] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {funil.corretorNome}
                  <span
                    className={
                      corretorSelecionado === funil.corretorId
                        ? "ml-1.5 text-white/80"
                        : "ml-1.5 text-slate-400"
                    }
                  >
                    {funil.totalLeads}
                  </span>
                </button>
              ))}

            </div>

          )}

        </div>

      )}

    </div>
  );
}
