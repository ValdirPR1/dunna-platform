"use client";

import Image from "next/image";
import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";

const regioes = [
  "Muro Alto",
  "Porto de Galinhas",
  "Praia dos Carneiros",
  "Tamandaré",
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
              {regioes.length}
            </h2>
            <p className="rotulo-luxo mt-4 text-slate-500">
              {t.sobre.regioesAtuacao}
            </p>
          </div>

        </div>

      </section>

      {/* Sócios */}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid items-start gap-12 md:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">

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
              {t.sobre.sociosTag}
            </span>

            <h2 className="mt-5 font-display text-4xl text-navy sm:text-5xl">
              {t.sobre.sociosTitulo}
            </h2>

            <p className="mt-6 font-sans text-lg font-light leading-8 text-slate-600">
              {t.sobre.sociosIntro}
            </p>

            <div className="mt-10 space-y-10">
              {t.sobre.socios.map((socio) => (
                <div key={socio.nome} className="border-t border-slate-300 pt-8">
                  <h3 className="font-display text-3xl font-light text-navy sm:text-4xl">
                    {socio.nome}
                  </h3>
                  <p className="rotulo-luxo mt-3 text-gold-dark">
                    {socio.experiencia}
                  </p>
                  <p className="mt-4 font-sans font-light leading-8 text-slate-600">
                    {socio.texto}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Filosofia */}

      <section className="bg-[#ede8e2] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:gap-20">

          <div>
            <span className="rotulo-luxo flex items-center text-gold-dark">
              <span className="fio-luxo" />
              {t.sobre.filosofiaTag}
            </span>

            <h2 className="mt-5 font-display text-4xl text-navy sm:text-5xl">
              {t.sobre.filosofiaTitulo}
            </h2>
          </div>

          <p className="font-sans text-lg font-light leading-9 text-slate-600">
            {t.sobre.filosofiaTexto}
          </p>

        </div>
      </section>

      {/* Diferenciais / Valores */}

      <section className="mx-auto max-w-7xl px-6 py-24">

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

      </section>

      {/* Atuação */}

      <section className="border-t border-slate-200 bg-[#f5f1ec]">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <span className="rotulo-luxo flex items-center text-gold-dark">
            <span className="fio-luxo" />
            {t.sobre.ondeAtuamosTag}
          </span>

          <h2 className="mt-5 font-display text-4xl text-navy sm:text-5xl">
            {t.sobre.regioesTitulo}
          </h2>

          <p className="mt-6 max-w-3xl font-sans text-lg font-light leading-8 text-slate-600">
            {t.sobre.atuacaoTexto}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {regioes.map((regiao) => (
              <span
                key={regiao}
                className="rotulo-luxo border border-slate-300 px-6 py-4 text-slate-700"
              >
                {regiao}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* Fechamento + CTA */}

      <section className="bg-[#0a0a0a] py-28 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">

          <p className="font-display text-2xl font-light leading-snug text-gold-light sm:text-3xl">
            {t.sobre.fechamento}
          </p>

          <div className="fio-luxo mx-auto my-10 block !mr-auto" />

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
