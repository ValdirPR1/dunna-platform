"use client";

import {
  CalendarDays,
  Clock,
} from "lucide-react";

const agenda = [
  {
    hora: "09:00",
    titulo: "Cliente João Pedro",
  },
  {
    hora: "11:30",
    titulo: "Reunião Construtora",
  },
  {
    hora: "15:00",
    titulo: "Visita Muro Alto",
  },
  {
    hora: "18:00",
    titulo: "Follow-up Investidor",
  },
];

export default function AgendaCard() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">

      <div className="mb-8 flex items-center gap-3">

        <CalendarDays className="text-[#C8A96A]" />

        <h2 className="text-2xl font-bold">
          Agenda de Hoje
        </h2>

      </div>

      <div className="space-y-4">

        {agenda.map((item) => (

          <div
            key={item.hora}
            className="flex items-center gap-4 rounded-2xl bg-zinc-800/40 p-4"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C8A96A]/15">

              <Clock
                size={18}
                className="text-[#C8A96A]"
              />

            </div>

            <div>

              <p className="font-semibold">

                {item.hora}

              </p>

              <p className="text-sm text-zinc-500">

                {item.titulo}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}