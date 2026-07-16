import { Users } from "lucide-react";

const leads = [
  "Carlos Henrique",
  "Fernanda Souza",
  "Ricardo Melo",
  "Ana Carolina",
];

export default function RecentLeadsPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Users className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">
          Leads Recentes
        </h2>

      </div>

      <div className="space-y-4">

        {leads.map((lead) => (

          <div
            key={lead}
            className="rounded-xl border border-slate-100 p-4"
          >

            <p className="font-medium">
              {lead}
            </p>

            <p className="text-sm text-slate-500">
              Novo lead recebido pelo site
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}