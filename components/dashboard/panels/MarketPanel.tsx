import { TrendingUp } from "lucide-react";

const mercados = [
  {
    regiao: "Porto de Galinhas",
    valor: "R$ 12.850/m²",
    variacao: "+3,2%",
  },
  {
    regiao: "Praia dos Carneiros",
    valor: "R$ 11.200/m²",
    variacao: "+2,1%",
  },
  {
    regiao: "Tamandaré",
    valor: "R$ 8.950/m²",
    variacao: "+1,4%",
  },
];

export default function MarketPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <TrendingUp className="text-[#C8A96A]" />

        <h2 className="text-xl font-semibold">
          Radar de Mercado
        </h2>

      </div>

      <div className="space-y-4">

        {mercados.map((item) => (

          <div
            key={item.regiao}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
          >

            <div>

              <p className="font-semibold">
                {item.regiao}
              </p>

              <p className="text-sm text-slate-500">
                {item.valor}
              </p>

            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {item.variacao}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}