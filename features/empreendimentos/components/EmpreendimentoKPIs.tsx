interface Props {
  unidades?: number;
  disponiveis?: number;
}

export default function EmpreendimentoKPIs({
  unidades = 0,
  disponiveis = 0,
}: Props) {

  const cards = [
    {
      titulo: "Unidades",
      valor: unidades,
    },
    {
      titulo: "Disponíveis",
      valor: disponiveis,
    },
    {
      titulo: "Vendidas",
      valor: unidades - disponiveis,
    },
    {
      titulo: "Publicação",
      valor: "Online",
    },
  ];

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => (

        <div
          key={card.titulo}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >

          <p className="text-slate-500">

            {card.titulo}

          </p>

          <h2 className="mt-4 text-4xl font-bold">

            {card.valor}

          </h2>

        </div>

      ))}

    </div>

  );

}