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

      <section className="bg-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">

          <span className="font-sans font-semibold text-gold">
            {t.vender.tag}
          </span>

          <h1 className="mt-4 break-words font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            {t.vender.titulo}
          </h1>

          <p className="mt-5 font-sans text-lg text-white/80">
            {t.vender.descricao}
          </p>

        </div>
      </section>

      {/* Benefícios */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-8 md:grid-cols-4">

          {t.vender.beneficios.map((beneficio, i) => {
            const Icone = ICONES[i];
            return (
              <div key={i}>
                <Icone className="text-gold" size={28} />
                <h3 className="mt-4 font-display text-lg font-bold text-navy">
                  {beneficio.titulo}
                </h3>
                <p className="mt-2 font-sans text-slate-500">
                  {beneficio.texto}
                </p>
              </div>
            );
          })}

        </div>

      </section>

      {/* Formulário */}

      <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl">

          <h2 className="text-center font-display text-3xl font-bold text-navy">
            {t.vender.formTitulo}
          </h2>

          <p className="mt-3 text-center font-sans text-slate-500">
            {t.vender.formSubtitulo}
          </p>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <VenderImovelForm />
          </div>

        </div>
      </section>

    </div>
  );
}
