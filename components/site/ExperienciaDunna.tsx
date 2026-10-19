"use client";

import { useIdioma } from "@/features/idioma/IdiomaContext";
import TituloSecao from "./TituloSecao";

// Seção escura com os três pilares do atendimento da Dunna —
// quebra o ritmo da página e reforça o valor agregado do serviço.
export default function ExperienciaDunna() {
  const { t } = useIdioma();

  return (
    <section className="bg-[#0a0a0a] py-28">

      <div className="mx-auto max-w-7xl px-6">

        <TituloSecao
          claro
          tag={t.luxo.experienciaTag}
          titulo={t.luxo.experienciaTitulo}
        />

        <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">

          {t.luxo.experiencia.map((item, i) => (

            <div key={item.titulo} className="border-t border-white/15 pt-8">

              <span className="font-display text-5xl font-extralight text-gold-light/70">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-6 font-display text-2xl text-white">
                {item.titulo}
              </h3>

              <p className="mt-4 font-sans font-light leading-8 text-white/60">
                {item.descricao}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
