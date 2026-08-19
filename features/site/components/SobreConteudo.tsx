"use client";

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

      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">

          <span className="font-semibold text-[#C8A96A]">
            {t.sobre.heroTag}
          </span>

          <h1 className="mt-4 max-w-3xl break-words font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            {t.sobre.heroTitulo}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/80">
            {t.sobre.heroDescricao}
          </p>

        </div>
      </section>

      {/* Números */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-8 md:grid-cols-3">

          <div>
            <h2 className="font-display text-3xl font-bold text-[#C8A96A] sm:text-4xl">
              +10
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              {t.sobre.anosExperiencia}
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-[#C8A96A] sm:text-4xl">
              +500
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              {t.sobre.imoveisComercializados}
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-[#C8A96A] sm:text-4xl">
              5
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              {t.sobre.regioesAtuacao}
            </p>
          </div>

        </div>

      </section>

      {/* Diferenciais */}

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <span className="font-semibold text-[#C8A96A]">
            {t.sobre.porQueTag}
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900">
            {t.sobre.diferenciaisTitulo}
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {t.sobre.diferenciais.map((item) => (
              <div
                key={item.titulo}
                className="rounded-3xl border border-slate-200 bg-white p-8"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {item.titulo}
                </h3>
                <p className="mt-4 text-slate-600">
                  {item.descricao}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Regiões */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <span className="font-semibold text-[#C8A96A]">
          {t.sobre.ondeAtuamosTag}
        </span>

        <h2 className="mt-4 text-4xl font-bold text-slate-900">
          {t.sobre.regioesTitulo}
        </h2>

        <div className="mt-8 flex flex-wrap gap-4">
          {regioes.map((regiao) => (
            <span
              key={regiao}
              className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700"
            >
              {regiao}
            </span>
          ))}
        </div>

      </section>

      {/* CTA */}

      <section className="bg-[#C8A96A] py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">

          <h2 className="text-4xl font-bold">
            {t.sobre.ctaTitulo}
          </h2>

          <p className="mt-4 text-lg text-white/90">
            {t.sobre.ctaDescricao}
          </p>

          <Link
            href="/site/contato"
            className="mt-8 inline-block rounded-2xl bg-slate-900 px-8 py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            {t.sobre.ctaBotao}
          </Link>

        </div>
      </section>

    </div>
  );
}
