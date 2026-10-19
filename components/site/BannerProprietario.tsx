"use client";

import Image from "next/image";
import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";

// Chamada pra proprietários anunciarem com a Dunna — leva pra página
// "Vender meu imóvel". Banner largo com foto e texto sobreposto.
export default function BannerProprietario() {
  const { t } = useIdioma();

  return (
    <section className="relative isolate overflow-hidden">

      <Image
        src="/regioes/muro-alto.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

      <div className="mx-auto max-w-7xl px-6 py-28 lg:py-36">

        <div className="max-w-2xl">

          <span className="rotulo-luxo flex items-center text-gold-light">
            <span className="fio-luxo" />
            {t.luxo.venderTag}
          </span>

          <h2 className="mt-6 break-words font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            {t.luxo.venderTitulo}
          </h2>

          <p className="mt-6 font-sans text-lg font-light leading-8 text-white/75">
            {t.luxo.venderTexto}
          </p>

          <Link
            href="/site/vender"
            className="rotulo-luxo mt-10 inline-block bg-gold px-9 py-4 text-white transition hover:bg-gold-dark"
          >
            {t.luxo.venderBotao}
          </Link>

        </div>

      </div>

    </section>
  );
}
