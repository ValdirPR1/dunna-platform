"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { listarTarefas } from "@/features/agenda/services/tarefas.service";
import { Tarefa } from "@/features/agenda/types/tarefa";

export default function AgendaPanel() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarTarefas()
      .then((todas) => {
        const hoje = new Date().toLocaleDateString("pt-BR");

        const deHoje = todas
          .filter(
            (t) =>
              !t.concluida &&
              new Date(t.data_hora).toLocaleDateString("pt-BR") === hoje
          )
          .slice(0, 4);

        setTarefas(deHoje);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <CalendarDays className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">
          Agenda
        </h2>

      </div>

      <div className="space-y-5">

        {loading ? (

          <p className="text-sm text-slate-400">Carregando...</p>

        ) : tarefas.length === 0 ? (

          <p className="text-sm text-slate-400">
            Nenhuma tarefa pra hoje.
          </p>

        ) : (

          tarefas.map((tarefa) => (

            <div
              key={tarefa.id}
              className="flex items-center justify-between border-b border-slate-100 pb-3"
            >

              <span className="font-semibold">
                {new Date(tarefa.data_hora).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span className="text-slate-500">
                {tarefa.titulo}
              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}
