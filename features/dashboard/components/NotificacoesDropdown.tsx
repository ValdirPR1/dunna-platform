"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  UserPlus,
  TrendingUp,
  CalendarClock,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import {
  listarNotificacoes,
  Notificacao,
  tempoRelativo,
} from "../services/notificacoes.service";

const CHAVE_ULTIMA_VISUALIZACAO = "dunna_notificacoes_ultima_visualizacao";
const CHAVE_APAGADAS = "dunna_notificacoes_apagadas";
const MAX_APAGADAS_GUARDADAS = 300;

export default function NotificacoesDropdown() {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [ultimaVisualizacao, setUltimaVisualizacao] = useState(0);
  const [apagadas, setApagadas] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listarNotificacoes()
      .then(setNotificacoes)
      .finally(() => setLoading(false));

    const salva = localStorage.getItem(CHAVE_ULTIMA_VISUALIZACAO);
    setUltimaVisualizacao(salva ? Number(salva) : 0);

    const salvasApagadas = localStorage.getItem(CHAVE_APAGADAS);
    setApagadas(salvasApagadas ? JSON.parse(salvasApagadas) : []);
  }, []);

  function apagarNotificacao(id: string) {
    setApagadas((atual) => {
      const novo = [...atual, id].slice(-MAX_APAGADAS_GUARDADAS);
      localStorage.setItem(CHAVE_APAGADAS, JSON.stringify(novo));
      return novo;
    });
  }

  const notificacoesVisiveis = notificacoes.filter(
    (n) => !apagadas.includes(n.id)
  );

  useEffect(() => {
    function fecharAoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    return () =>
      document.removeEventListener("mousedown", fecharAoClicarFora);
  }, []);

  function alternarAberto() {
    const vaiAbrir = !aberto;
    setAberto(vaiAbrir);

    if (vaiAbrir) {
      // Marca como visualizado agora — a bolinha vermelha some, mas
      // guardamos o valor ANTIGO só pra saber o que destacar como
      // "novo" durante essa visualização
      const agora = Date.now();
      localStorage.setItem(CHAVE_ULTIMA_VISUALIZACAO, String(agora));
    }
  }

  const temNaoLidas = notificacoesVisiveis.some(
    (n) => new Date(n.data).getTime() > ultimaVisualizacao
  );

  return (
    <div ref={ref} className="relative">

      <button
        onClick={alternarAberto}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100"
      >
        <Bell size={19} />

        {temNaoLidas && (
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {aberto && (
        <div className="fixed left-3 right-3 top-20 z-50 rounded-2xl border border-slate-200 bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-96">

          <div className="border-b border-slate-100 px-5 py-4">
            <p className="font-sans font-semibold text-navy">
              Atividade recente
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">

            {loading ? (

              <p className="p-5 font-sans text-sm text-slate-400">
                Carregando...
              </p>

            ) : notificacoesVisiveis.length === 0 ? (

              <p className="p-5 font-sans text-sm text-slate-400">
                Nenhuma atividade recente.
              </p>

            ) : (

              notificacoesVisiveis.map((n) => {
                const naoLida =
                  new Date(n.data).getTime() > ultimaVisualizacao;

                return (
                  <NotificacaoItem
                    key={n.id}
                    notificacao={n}
                    naoLida={naoLida}
                    onApagar={apagarNotificacao}
                  />
                );
              })

            )}

          </div>

        </div>
      )}

    </div>
  );
}

function NotificacaoItem({
  notificacao,
  naoLida,
  onApagar,
}: {
  notificacao: Notificacao;
  naoLida: boolean;
  onApagar: (id: string) => void;
}) {
  const [saindo, setSaindo] = useState(false);

  function apagar() {
    if (saindo) return;
    setSaindo(true);
    setTimeout(() => onApagar(notificacao.id), 150);
  }

  return (
    <div
      style={{ opacity: saindo ? 0 : 1, transition: "opacity 0.15s ease-out" }}
      className={`flex items-start gap-3 border-b border-slate-50 px-5 py-4 last:border-b-0 ${
        naoLida ? "bg-gold/5" : "bg-white"
      }`}
    >

      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          notificacao.tipo === "lead-parado"
            ? "bg-red-50 text-red-500"
            : "bg-gold/10 text-gold"
        }`}
      >
        {notificacao.tipo === "lead" ? (
          <UserPlus size={14} />
        ) : notificacao.tipo === "tarefa" ? (
          <CalendarClock size={14} />
        ) : notificacao.tipo === "lead-parado" ? (
          <AlertTriangle size={14} />
        ) : (
          <TrendingUp size={14} />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`font-sans text-sm ${
              naoLida ? "font-semibold text-navy" : "text-slate-500"
            }`}
          >
            {notificacao.texto}
          </p>

          {naoLida && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
          )}
        </div>

        <p className="mt-1 font-sans text-xs text-slate-400">
          {tempoRelativo(notificacao.data)}
        </p>
      </div>

      <button
        onClick={apagar}
        aria-label="Apagar notificação"
        title="Apagar"
        className="mt-0.5 shrink-0 rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={14} />
      </button>

    </div>
  );
}
