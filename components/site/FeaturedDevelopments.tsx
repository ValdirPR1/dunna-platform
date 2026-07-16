import Link from "next/link";

const developments = [
  {
    id: 1,
    title: "Makani Residence",
    city: "Praia dos Carneiros",
  },
  {
    id: 2,
    title: "Palm Beach",
    city: "Porto de Galinhas",
  },
  {
    id: 3,
    title: "Beach Class Wave",
    city: "Muro Alto",
  },
];

export default function FeaturedDevelopments() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12">

          <span className="font-semibold text-[#C8A96A]">
            EMPREENDIMENTOS
          </span>

          <h2 className="mt-3 text-5xl font-bold">
            Lançamentos e empreendimentos
          </h2>

        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {developments.map((item) => (

            <Link
              key={item.id}
              href={`/site/empreendimento/${item.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
            >

              <div className="mb-8 h-56 rounded-2xl bg-slate-200" />

              <h3 className="text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-3 text-slate-500">
                {item.city}
              </p>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}