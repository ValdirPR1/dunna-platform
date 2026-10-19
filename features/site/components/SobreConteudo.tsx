"use client";

import Image from "next/image";
import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";

const regioes = [
  "Porto de Galinhas",
  "Muro Alto",
  "Praia dos Carneiros",
  "Tamandaré",
  "São Miguel dos Milagres",
];

export default function SobreConteudo() {
  const { t } = useIdioma();

  return (
    <div>

      {/* Hero */}

      <section className="bg-[#0a0a0a] py-32 text-white">
        <div className="mx-auto max-w-7xl px-6">

          <span className="rotulo-luxo flex items-center text-gold-light">
            <span className="fio-luxo" />
            {t.sobre.heroTag}
          </span>

          <h1 className="mt-8 max-w-4xl break-words font-display text-4xl leading-[1.1] sm:text-5xl lg:text-7xl">
            {t.sobre.heroTitulo}
          </h1>

          <p className="mt-8 max-w-2xl font-sans text-lg font-light leading-8 text-white/70">
            {t.sobre.heroDescricao}
          </p>

        </div>
      </section>

      {/* Números */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-10 md:grid-cols-3">

          <div>
            <h2 className="font-display text-6xl font-extralight text-gold sm:text-7xl">
              +10
            </h2>
            <p className="rotulo-luxo mt-4 text-slate-500">
              {t.sobre.anosExperiencia}
            </p>
          </div>

          <div>
            <h2 className="font-display text-6xl font-extralight text-gold sm:text-7xl">
              +500
            </h2>
            <p className="rotulo-luxo mt-4 text-slate-500">
              {t.sobre.imoveisComercializados}
            </p>
          </div>

          <div>
            <h2 className="font-display text-6xl font-extralight text-gold sm:text-7xl">
              5
            </h2>
            <p className="rotulo-luxo mt-4 text-slate-500">
              {t.sobre.regioesAtuacao}
            </p>
          </div>

        </div>

      </section>

      {/* Sócios */}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute -bottom-4 -right-4 h-full w-full border border-gold" />
            <Image
              src="/images/equipe/valdir-e-ednaldo.jpg"
              alt="Valdir Pereira e Ednaldo Silva"
              width={945}
              height={1665}
              sizes="(max-width: 768px) 90vw, 420px"
              className="relative h-auto w-full"
            />
          </div>

          <div>
            <span className="rotulo-luxo flex items-center text-gold-dark">
              <span className="fio-luxo" />
              Dunna Imob
            </span>

            <div className="mt-10 space-y-10">
              <div>
                <h2 className="font-display text-4xl text-navy sm:text-5xl">
                  Valdir Pereira
                </h2>
                <p className="rotulo-luxo mt-3 text-slate-500">Dunna Imob</p>
              </div>
              <div>
                <h2 className="font-display text-4xl text-navy sm:text-5xl">
                  Ednaldo Silva
                </h2>
                <p className="rotulo-luxo mt-3 text-slate-500">Dunna Imob</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Diferenciais */}

      <section className="bg-[#ede8e2] py-24">
        <div className="mx-auto max-w-7xl px-6">

          <span className="rotulo-luxo flex items-center text-gold-dark">
            <span className="fio-luxo" />
            {t.sobre.porQueTag}
          </span>

          <h2 className="mt-5 font-display text-4xl text-navy sm:text-5xl">
            {t.sobre.diferenciaisTitulo}
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {t.sobre.diferenciais.map((item) => (
              <div
                key={item.titulo}
                className="border-t-2 border-gold bg-white p-10 shadow-sm"
              >
                <h3 className="font-display text-2xl font-normal text-navy">
                  {item.titulo}
                </h3>
                <p className="mt-4 font-sans font-light leading-8 text-slate-600">
                  {item.descricao}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Regiões */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <span className="rotulo-luxo flex items-center text-gold-dark">
          <span className="fio-luxo" />
          {t.sobre.ondeAtuamosTag}
        </span>

        <h2 className="mt-5 font-display text-4xl text-navy sm:text-5xl">
          {t.sobre.regioesTitulo}
        </h2>

        <div className="mt-8 flex flex-wrap gap-4">
          {regioes.map((regiao) => (
            <span
              key={regiao}
              className="rotulo-luxo border border-slate-300 px-6 py-4 text-slate-700"
            >
              {regiao}
            </span>
          ))}
        </div>

      </section>

      {/* CTA */}

      <section className="bg-[#0a0a0a] py-28 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">

          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            {t.sobre.ctaTitulo}
          </h2>

          <p className="mt-6 font-sans text-lg font-light leading-8 text-white/65">
            {t.sobre.ctaDescricao}
          </p>

          <Link
            href="/site/contato"
            className="rotulo-luxo mt-10 inline-block bg-gold px-10 py-5 text-white transition hover:bg-gold-dark"
          >
            {t.sobre.ctaBotao}
          </Link>

        </div>
      </section>

    </div>
  );
}
