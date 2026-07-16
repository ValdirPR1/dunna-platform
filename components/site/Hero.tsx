"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent" />

      <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-6">

        <div className="max-w-3xl">

          <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 font-sans text-sm font-medium tracking-wide text-gold">
            ESPECIALISTAS EM IMÓVEIS DE PRAIA
          </span>

          <h1 className="mt-8 font-display text-6xl font-bold leading-tight text-white">

            Viva o melhor do litoral.

            <br />

            Invista com segurança.

          </h1>

          <p className="mt-8 max-w-2xl font-sans text-xl leading-9 text-slate-300">

            Apartamentos, casas e empreendimentos selecionados em
            Porto de Galinhas, Muro Alto, Praia dos Carneiros,
            Tamandaré e São Miguel dos Milagres.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              href="/site/imoveis"
              className="rounded-2xl bg-gold px-8 py-4 font-sans text-lg font-semibold text-white transition hover:bg-gold-dark"
            >
              Ver imóveis
            </Link>

            <Link
              href="/site/empreendimentos"
              className="rounded-2xl border border-white/30 px-8 py-4 font-sans text-lg font-semibold text-white transition hover:bg-white hover:text-navy"
            >
              Empreendimentos
            </Link>

          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">

            <div>

              <h3 className="font-display text-4xl font-bold text-white">
                +10
              </h3>

              <p className="mt-2 font-sans text-slate-300">
                anos de mercado
              </p>

            </div>

            <div>

              <h3 className="font-display text-4xl font-bold text-white">
                +500
              </h3>

              <p className="mt-2 font-sans text-slate-300">
                imóveis disponíveis
              </p>

            </div>

            <div>

              <h3 className="font-display text-4xl font-bold text-white">
                5
              </h3>

              <p className="mt-2 font-sans text-slate-300">
                regiões atendidas
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
