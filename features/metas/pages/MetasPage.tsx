"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Phone,
  MapPin,
  Users,
  TrendingUp,
  ClipboardList,
  Pencil,
  History,
  Target,
  FileDown,
  Sparkles,
} from "lucide-react";
import {
  listarMetas,
  obterProgressoAtual,
  obterHistorico,
} from "../services/metas.service";
import { Meta, ProgressoPeriodo, METRICAS, TipoMetrica } from "../types/meta";
import BarraProgresso from "../components/BarraProgresso";
import EditarMetasModal from "../components/EditarMetasModal";
import HistoricoMetas from "../components/HistoricoMetas";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import { useAuth } from "@/features/core/auth/useAuth";
import { gerarRelatorioCorretor } from "@/features/relatorios/utils/gerarPdfRelatorio";

const iconesPorMetrica: Record<TipoMetrica, any> = {
  ligacoes: Phone,
  visitas: MapPin,
  reunioes: Users,
  vendas: TrendingUp,
  captacoes: ClipboardList,
};

export default function MetasPage() {
  const { usuario } = useAuth();
  const ehMaster = usuario?.papel === "master";

  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [progresso, setProgresso] = useState<Record<string, Record<TipoMetrica, number>>>({});
  const [loading, setLoading] = useState(true);

  const [corretorEditando, setCorretorEditando] = useState<Corretor | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [corretorHistoricoId, setCorretorHistoricoId] = useState<string | null>(null);
  const [historico, setHistorico] = useState<ProgressoPeriodo[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [gerandoRelatorioId, setGerandoRelatorioId] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      if (ehMaster) {
        const dadosCorretores = await listarCorretoresAtivos();
        setCorretores(dadosCorretores);

        const ids = dadosCorretores.map((c) => c.id);
        const [dadosMetas, dadosProgresso] = await Promise.all([
          listarMetas(),
          obterProgressoAtual(ids),
        ]);
        setMetas(dadosMetas);
        setProgresso(dadosProgresso);
      } else if (usuario?.corretor_id) {
        const [dadosMetas, dadosProgresso] = await Promise.all([
          listarMetas(usuario.corretor_id),
          obterProgressoAtual([usuario.corretor_id]),
        ]);
        setMetas(dadosMetas);
        setProgresso(dadosProgresso);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!usuario) return;
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id]);

  async function abrirHistorico(corretorId: string) {
    if (corretorHistoricoId === corretorId) {
      setCorretorHistoricoId(null);
      return;
    }

    setCorretorHistoricoId(corretorId);
    setCarregandoHistorico(true);
    try {
      const dados = await obterHistorico(corretorId);
      setHistorico(dados);
    } finally {
      setCarregandoHistorico(false);
    }
  }

  function valorPara(corretorId: string, tipo: TipoMetrica) {
    return metas.find((m) => m.corretor_id === corretorId && m.tipo_metrica === tipo)?.valor_alvo ?? 0;
  }

  function realizadoPara(corretorId: string, tipo: TipoMetrica) {
    return progresso[corretorId]?.[tipo] ?? 0;
  }

  async function handleGerarRelatorio(corretor: Corretor) {
    setGerandoRelatorioId(corretor.id);
    try {
      await gerarRelatorioCorretor(corretor.id, corretor.nome);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível gerar o relatório.");
    } finally {
      setGerandoRelatorioId(null);
    }
  }

  return (
    <div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-navy">
            <Target className="text-gold" size={28} />
            Metas
          </h1>

          <p className="mt-2 font-sans text-slate-500">
            {ehMaster
              ? "Defina os alvos de cada corretor. O realizado é calculado automaticamente a partir do que acontece no CRM."
              : "Seus alvos do período atual — calculados automaticamente a partir das suas ligações, visitas, reuniões, vendas e captações registradas no CRM."}
          </p>
        </div>

      </div>

      <div className="mt-8">

        {loading ? (

          <p className="font-sans text-slate-400">Carregando...</p>

        ) : ehMaster ? (

          corretores.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
              <p className="font-sans text-slate-500">Nenhum corretor ativo encontrado.</p>
            </div>
          ) : (

            <div className="space-y-5">

              {corretores.map((corretor) => (

                <div key={corretor.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-sans text-lg font-semibold text-navy">{corretor.nome}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirHistorico(corretor.id)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-sans text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <History size={15} />
                        Histórico
                      </button>
                      <button
                        onClick={() => handleGerarRelatorio(corretor)}
                        disabled={gerandoRelatorioId === corretor.id}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-sans text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                      >
                        <FileDown size={15} />
                        {gerandoRelatorioId === corretor.id ? "Gerando..." : "Relatório"}
                      </button>
                      <button
                        onClick={() => {
                          setCorretorEditando(corretor);
                          setModalAberto(true);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-gold-dark"
                      >
                        <Pencil size={15} />
                        Editar metas
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {METRICAS.map((m) => {
                      const Icone = iconesPorMetrica[m.tipo];
                      const alvo = valorPara(corretor.id, m.tipo);
                      const realizado = realizadoPara(corretor.id, m.tipo);

                      return (
                        <div key={m.tipo} className="rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center gap-2 font-sans text-xs font-semibold text-slate-500">
                            <Icone size={14} />
                            {m.label}
                          </div>
                          <p className="mt-1 font-sans text-sm font-bold text-navy">
                            {realizado} <span className="font-normal text-slate-400">/ {alvo}</span>
                          </p>
                          <div className="mt-2">
                            <BarraProgresso realizado={realizado} alvo={alvo} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {corretorHistoricoId === corretor.id && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      {carregandoHistorico ? (
                        <p className="font-sans text-sm text-slate-400">Carregando histórico...</p>
                      ) : (
                        <HistoricoMetas historico={historico} />
                      )}
                    </div>
                  )}

                </div>

              ))}

            </div>

          )

        ) : (

          <div className="space-y-8">

            <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-sm text-slate-500">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-gold" />
              Esses números são calculados sozinhos: toda ligação, visita ou reunião que
              você concluir vinculada a um lead conta automaticamente aqui — não precisa
              lançar nada.
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {METRICAS.map((m) => {
                const Icone = iconesPorMetrica[m.tipo];
                const alvo = usuario?.corretor_id ? valorPara(usuario.corretor_id, m.tipo) : 0;
                const realizado = usuario?.corretor_id ? realizadoPara(usuario.corretor_id, m.tipo) : 0;

                return (
                  <div key={m.tipo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-2 font-sans text-sm font-semibold text-slate-500">
                      <Icone size={16} className="text-gold" />
                      {m.label} <span className="text-slate-400">({m.labelPeriodo})</span>
                    </div>

                    <p className="mt-2 font-display text-2xl font-bold text-navy">
                      {realizado} <span className="text-base font-normal text-slate-400">/ {alvo}</span>
                    </p>

                    <div className="mt-3">
                      <BarraProgresso realizado={realizado} alvo={alvo} />
                    </div>

                  </div>
                );
              })}
            </div>

            <div>
              <h2 className="mb-4 font-display text-xl font-bold text-navy">Histórico</h2>
              {usuario?.corretor_id && (
                <HistoricoPessoal corretorId={usuario.corretor_id} />
              )}
            </div>

          </div>

        )}

      </div>

      {ehMaster && (
        <EditarMetasModal
          open={modalAberto}
          onClose={() => setModalAberto(false)}
          onSaved={carregar}
          corretor={corretorEditando}
          metas={metas.filter((m) => m.corretor_id === corretorEditando?.id)}
          usuarioId={usuario?.id ?? ""}
        />
      )}

    </div>
  );
}

function HistoricoPessoal({ corretorId }: { corretorId: string }) {
  const [historico, setHistorico] = useState<ProgressoPeriodo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    obterHistorico(corretorId)
      .then(setHistorico)
      .finally(() => setCarregando(false));
  }, [corretorId]);

  if (carregando) {
    return <p className="font-sans text-sm text-slate-400">Carregando histórico...</p>;
  }

  return <HistoricoMetas historico={historico} />;
}
