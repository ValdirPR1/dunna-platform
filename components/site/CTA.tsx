"use client";

import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function CTA() {
  const { t } = useIdioma();

  return (
    <section className="bg-[#0a0a0a] py-28">

      <div className="mx-auto max-w-4xl px-6 text-center">

        <span className="fio-luxo" style={{ marginRight: 0 }} />

        <h2 className="mt-8 break-words font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
          {t.cta.titulo}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl font-sans text-lg font-light leading-8 text-white/65">
          {t.cta.descricao}
        </p>

        <a
          href="https://wa.me/5581996825134"
          target="_blank"
          rel="noopener noreferrer"
          className="rotulo-luxo mt-12 inline-block border border-gold px-10 py-5 text-gold-light transition hover:bg-gold hover:text-white"
        >
          {t.cta.botao}
        </a>

      </div>

    </section>
  );
}
