"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, UserPlus, TrendingUp, CalendarClock, AlertTriangle } from "lucide-react";
import {
  listarNotificacoes,
  Notificacao,
  tempoRelativo,
} from "../services/notificacoes.service";

export default function NotificacoesDropdown() {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listarNotificacoes()
      .then(setNotificacoes)
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div ref={ref} className="relative">

      <button
        onClick={() => setAberto((v) => !v)}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100"
      >
        <Bell size={19} />

        {notificacoes.length > 0 && (
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {aberto && (
        <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl border border-slate-200 bg-white shadow-xl">

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

            ) : notificacoes.length === 0 ? (

              <p className="p-5 font-sans text-sm text-slate-400">
                Nenhuma atividade recente.
              </p>

            ) : (

              notificacoes.map((n) => (

                <div
                  key={n.id}
                  className="flex items-start gap-3 border-b border-slate-50 px-5 py-4 last:border-b-0"
                >

                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      n.tipo === "lead-parado"
                        ? "bg-red-50 text-red-500"
                        : "bg-gold/10 text-gold"
                    }`}
                  >
                    {n.tipo === "lead" ? (
                      <UserPlus size={14} />
                    ) : n.tipo === "tarefa" ? (
                      <CalendarClock size={14} />
                    ) : n.tipo === "lead-parado" ? (
                      <AlertTriangle size={14} />
                    ) : (
                      <TrendingUp size={14} />
                    )}
                  </div>

                  <div>
                    <p className="font-sans text-sm text-navy">
                      {n.texto}
                    </p>

                    <p className="mt-1 font-sans text-xs text-slate-400">
                      {tempoRelativo(n.data)}
                    </p>
                  </div>

                </div>

              ))

            )}

          </div>

        </div>
      )}

    </div>
  );
}
