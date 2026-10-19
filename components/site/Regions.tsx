"use client";

import Image from "next/image";
import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import TituloSecao from "./TituloSecao";

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
  const { t } = useIdioma();

  // Grade editorial: cartões de larguras alternadas (2/3 + 1/3 e
  // depois 1/3 + 2/3) em vez de quatro quadrados iguais.
  const larguras = [
    "md:col-span-2",
    "md:col-span-1",
    "md:col-span-1",
    "md:col-span-2",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-28">

      <div className="mb-16">

        <TituloSecao
          tag={t.regioes.tag}
          titulo={t.regioes.titulo}
          descricao={t.regioes.descricao}
        />

      </div>

      <div className="grid gap-5 md:grid-cols-3">

        {regions.map((region, i) => (

          <Link
            key={region.name}
            href={region.href}
            className={`zoom-luxo group relative block h-[380px] w-full overflow-hidden md:h-[460px] ${larguras[i]}`}
          >

            <Image
              src={region.image}
              alt={region.name}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8">

              <h3 className="break-words font-display text-3xl font-light text-white sm:text-4xl">
                {region.name}
              </h3>

              <p className="rotulo-luxo mt-4 flex items-center text-white/80 transition-all group-hover:text-gold-light">
                <span className="fio-luxo transition-all duration-500 group-hover:w-14" />
                {t.regioes.verImoveis.replace(" →", "")}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}
