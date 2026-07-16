import { TriangleAlert } from "lucide-react";

const alerts = [
  {
    titulo: "Makani 204",
    texto: "Preço 8% acima do mercado",
  },
  {
    titulo: "Palm Beach 302",
    texto: "Sem atualização há 18 dias",
  },
  {
    titulo: "Casa Carneiros",
    texto: "Fotos com baixa qualidade",
  },
];

export default function AdvisorPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <TriangleAlert className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">

          Advisor IA

        </h2>

      </div>

      <div className="space-y-4">

        {alerts.map((item) => (

          <div
            key={item.titulo}
            className="rounded-2xl bg-amber-50 p-4"
          >

            <p className="font-semibold">

              {item.titulo}

            </p>

            <p className="mt-1 text-sm text-slate-500">

              {item.texto}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
}