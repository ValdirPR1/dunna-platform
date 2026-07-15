"use client";

export default function EmpreendimentoKPIs() {
  const cards = [
    {
      titulo: "Empreendimentos",
      valor: "48",
    },
    {
      titulo: "Unidades",
      valor: "1.246",
    },
    {
      titulo: "VGV",
      valor: "R$ 48,5 mi",
    },
    {
      titulo: "Construtoras",
      valor: "18",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.titulo}
          className="rounded-xl bg-zinc-900 border border-zinc-800 p-6"
        >
          <p className="text-zinc-400 text-sm">{card.titulo}</p>

          <h2 className="text-3xl font-bold mt-2">
            {card.valor}
          </h2>
        </div>
      ))}
    </div>
  );
}