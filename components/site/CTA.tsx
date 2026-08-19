"use client";

import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function CTA() {
  const { t } = useIdioma();

  return (
    <section className="bg-[#101828] py-24">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="break-words font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {t.cta.titulo}
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-300">
          {t.cta.descricao}
        </p>

        <a
          href="https://wa.me/5581996825134"
          className="mt-10 inline-block rounded-2xl bg-[#C8A96A] px-10 py-5 text-lg font-semibold text-white"
        >
          {t.cta.botao}
        </a>

      </div>

    </section>
  );
}
