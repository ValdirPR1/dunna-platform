"use client";

import Image from "next/image";
import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";

// Bloco editorial logo depois do topo: apresenta a visão da Dunna
// (imóvel de praia como estilo de vida e patrimônio, não só
// investimento) com uma foto grande ao lado.
export default function ManifestoHome() {
  const { t } = useIdioma();

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-24">

      <div>

        <span className="rotulo-luxo flex items-center text-gold-dark">
          <span className="fio-luxo" />
          {t.luxo.manifestoTag}
        </span>

        <h2 className="mt-6 break-words font-display text-4xl leading-[1.15] text-navy sm:text-5xl lg:text-6xl">
          {t.luxo.manifestoTitulo}
        </h2>

        <p className="mt-8 max-w-xl font-sans text-lg font-light leading-9 text-slate-600">
          {t.luxo.manifestoTexto}
        </p>

        <Link
          href="/site/sobre"
          className="rotulo-luxo mt-10 inline-block border-b border-navy pb-2 text-navy transition hover:border-gold hover:text-gold-dark"
        >
          {t.luxo.manifestoLink} →
        </Link>

      </div>

      <div className="relative">

        {/* Moldura dourada deslocada atrás da foto */}
        <div className="absolute -bottom-5 -right-5 hidden h-full w-full border border-gold/60 sm:block" />

        <div className="zoom-luxo relative h-[480px] w-full overflow-hidden lg:h-[580px]">
          <Image
            src="/regioes/praia-dos-carneiros.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

      </div>

    </section>
  );
}
