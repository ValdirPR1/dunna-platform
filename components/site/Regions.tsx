import Link from "next/link";

const regions = [
  {
    name: "Porto de Galinhas",
    image: "/regioes/porto-de-galinhas.jpg",
    href: "/site/imoveis?regiao=porto-de-galinhas",
  },
  {
    name: "Muro Alto",
    image: "/regioes/muro-alto.jpg",
    href: "/site/imoveis?regiao=muro-alto",
  },
  {
    name: "Praia dos Carneiros",
    image: "/regioes/praia-dos-carneiros.jpg",
    href: "/site/imoveis?regiao=praia-dos-carneiros",
  },
  {
    name: "Tamandaré",
    image: "/regioes/tamandare.jpg",
    href: "/site/imoveis?regiao=tamandare",
  },
];

export default function Regions() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">

      <div className="mb-14">

        <span className="font-semibold text-[#C8A96A]">
          DESTINOS
        </span>

        <h2 className="mt-3 text-5xl font-bold text-slate-900">
          Explore as melhores regiões
        </h2>

        <p className="mt-4 max-w-3xl text-lg text-slate-500">
          Descubra os destinos mais desejados do litoral
          pernambucano e encontre o imóvel perfeito para
          investir ou aproveitar com sua família.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        {regions.map((region) => (

          <Link
            key={region.name}
            href={region.href}
            className="group relative overflow-hidden rounded-3xl"
          >

            <img
              src={region.image}
              alt={region.name}
              className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-8">

              <h3 className="text-4xl font-bold text-white">
                {region.name}
              </h3>

              <p className="mt-3 text-white/80">
                Ver imóveis →
              </p>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}