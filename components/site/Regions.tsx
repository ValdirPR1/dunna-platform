import Image from "next/image";
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
    href: "/site/imoveis?regiao=carneiros",
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

        <h2 className="mt-3 break-words font-display text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
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
            className="group relative block h-[360px] w-full overflow-hidden rounded-3xl"
          >

            <Image
              src={region.image}
              alt={region.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8">

              <h3 className="break-words font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
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