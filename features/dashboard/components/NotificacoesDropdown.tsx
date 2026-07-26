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

// Largura do botão vermelho revelado ao arrastar (px)
const LARGURA_BOTAO_APAGAR = 88;
// Se arrastar além disso, apaga sozinho ao soltar — sem precisar tocar no botão
const LIMITE_AUTO_APAGAR = 160;

function NotificacaoItem({
  notificacao,
  naoLida,
  onApagar,
}: {
  notificacao: Notificacao;
  naoLida: boolean;
  onApagar: (id: string) => void;
}) {
  const [dragX, setDragX] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const arrastandoRef = useRef(false);
  const inicioXRef = useRef(0);

  function apagar() {
    if (saindo) return;
    setSaindo(true);
    setDragX(-500);
    setTimeout(() => onApagar(notificacao.id), 180);
  }

  function aoIniciarArrasto(e: React.PointerEvent<HTMLDivElement>) {
    arrastandoRef.current = true;
    inicioXRef.current = e.clientX - dragX;
    setArrastando(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function aoMoverArrasto(e: React.PointerEvent<HTMLDivElement>) {
    if (!arrastandoRef.current) return;
    const novoX = e.clientX - inicioXRef.current;
    // só arrasta pra esquerda (valores negativos); um pouco de folga pra
    // direita pra não travar seco se o dedo escorregar
    setDragX(Math.min(20, Math.max(novoX, -LIMITE_AUTO_APAGAR - 40)));
  }

  function aoSoltarArrasto() {
    if (!arrastandoRef.current) return;
    arrastandoRef.current = false;
    setArrastando(false);

    if (dragX < -LIMITE_AUTO_APAGAR) {
      apagar();
    } else if (dragX < -LARGURA_BOTAO_APAGAR / 2) {
      setDragX(-LARGURA_BOTAO_APAGAR);
    } else {
      setDragX(0);
    }
  }

  return (
    <div className="relative overflow-hidden border-b border-slate-50 last:border-b-0">

      <button
        onClick={apagar}
        aria-label="Apagar notificação"
        className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-red-500 text-white"
      >
        <Trash2 size={18} />
      </button>

      <div
        onPointerDown={aoIniciarArrasto}
        onPointerMove={aoMoverArrasto}
        onPointerUp={aoSoltarArrasto}
        onPointerCancel={aoSoltarArrasto}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: arrastando ? "none" : "transform 0.2s ease-out",
          opacity: saindo ? 0 : 1,
          touchAction: "pan-y",
        }}
        className={`relative flex items-start gap-3 px-5 py-4 ${
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

      </div>

    </div>
  );
}
