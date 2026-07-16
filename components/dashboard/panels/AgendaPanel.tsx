import { CalendarDays } from "lucide-react";

const agenda = [
  ["09:00", "Visita Makani"],
  ["11:30", "Contrato Palm Beach"],
  ["15:00", "Captação Porto"],
];

export default function AgendaPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <CalendarDays className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">

          Agenda

        </h2>

      </div>

      <div className="space-y-5">

        {agenda.map(([hora, titulo]) => (

          <div
            key={hora}
            className="flex items-center justify-between border-b border-slate-100 pb-3"
          >

            <span className="font-semibold">

              {hora}

            </span>

            <span className="text-slate-500">

              {titulo}

            </span>

          </div>

        ))}

      </div>

    </div>
  );
}