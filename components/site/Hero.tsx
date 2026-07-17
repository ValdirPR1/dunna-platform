import Link from "next/link";
import AnimatedNumber from "./AnimatedNumber";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">

      {/* Vídeo da Praia dos Carneiros */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      >
        <source
          src="https://clzlssjyhgiiiyjcrvtk.supabase.co/storage/v1/object/public/imoveis/careneiros.MP4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/55 to-navy/25" />

      <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-6 py-20">

        <div className="max-w-3xl">

          <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 font-sans text-sm font-medium tracking-wide text-gold">
            ESPECIALISTAS EM IMÓVEIS DE PRAIA
          </span>

          <h1 className="mt-8 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">

            Viva o melhor do litoral.

            <br />

            Invista com segurança.

          </h1>

          <p className="mt-8 max-w-2xl font-sans text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">

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

          <div className="mt-14 inline-flex items-center gap-8 rounded-2xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-sm sm:gap-10">

            <div>

              <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">
                <AnimatedNumber numero={10} prefixo="+" />
              </h3>

              <p className="mt-2 font-sans text-sm text-slate-100 sm:text-base">
                anos de mercado
              </p>

            </div>

            <div className="h-12 w-px bg-white/20" />

            <div>

              <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">
                <AnimatedNumber numero={5} />
              </h3>

              <p className="mt-2 font-sans text-sm text-slate-100 sm:text-base">
                regiões atendidas
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
