import { Activity } from "lucide-react";

const atividades = [
  "Novo imóvel cadastrado",
  "Lead convertido em cliente",
  "Empreendimento atualizado",
  "Nova visita agendada",
];

export default function ActivityPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Activity className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">
          Atividades Recentes
        </h2>

      </div>

      <div className="space-y-4">

        {atividades.map((item) => (

          <div
            key={item}
            className="rounded-xl bg-slate-50 p-4"
          >

            {item}

          </div>

        ))}

      </div>

    </div>
  );
}