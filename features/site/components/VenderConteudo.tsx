"use client";

import { TrendingUp, Users, ShieldCheck, Clock } from "lucide-react";
import VenderImovelForm from "./VenderImovelForm";
import { useIdioma } from "@/features/idioma/IdiomaContext";

const ICONES = [Users, TrendingUp, ShieldCheck, Clock];

export default function VenderConteudo() {
  const { t } = useIdioma();

  return (
    <div>

      {/* Hero */}

      <section className="bg-[#0a0a0a] px-6 py-28 text-white">
        <div className="mx-auto max-w-4xl text-center">

          <span className="rotulo-luxo flex items-center justify-center text-gold-light">
            <span className="fio-luxo" />
            {t.vender.tag}
          </span>

          <h1 className="mt-8 break-words font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            {t.vender.titulo}
          </h1>

          <p className="mt-6 font-sans text-lg font-light leading-8 text-white/70">
            {t.vender.descricao}
          </p>

        </div>
      </section>

      {/* Benefícios */}

      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="grid gap-8 md:grid-cols-4">

          {t.vender.beneficios.map((beneficio, i) => {
            const Icone = ICONES[i];
            return (
              <div key={i}>
                <Icone className="text-gold" size={28} />
                <h3 className="mt-5 font-display text-xl font-normal text-navy">
                  {beneficio.titulo}
                </h3>
                <p className="mt-3 font-sans font-light leading-8 text-slate-500">
                  {beneficio.texto}
                </p>
              </div>
            );
          })}

        </div>

      </section>

      {/* Formulário */}

      <section className="border-t border-slate-200 bg-[#ede8e2] px-6 py-24">
        <div className="mx-auto max-w-2xl">

          <h2 className="text-center font-display text-4xl text-navy">
            {t.vender.formTitulo}
          </h2>

          <p className="mt-3 text-center font-sans text-slate-500">
            {t.vender.formSubtitulo}
          </p>

          <div className="mt-10 border-t-2 border-gold bg-white p-8 shadow-md sm:p-10">
            <VenderImovelForm />
          </div>

        </div>
      </section>

    </div>
  );
}
