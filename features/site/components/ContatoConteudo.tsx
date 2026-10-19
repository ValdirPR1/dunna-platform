"use client";

import ContatoForm from "./ContatoForm";
import { useIdioma } from "@/features/idioma/IdiomaContext";

interface Props {
  whatsapp?: string;
  email?: string;
  endereco?: string;
}

export default function ContatoConteudo({ whatsapp, email, endereco }: Props) {
  const { t } = useIdioma();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      <span className="rotulo-luxo flex items-center text-gold-dark">
        <span className="fio-luxo" />
        {t.contato.outrosCanais}
      </span>

      <h1 className="mt-5 break-words font-display text-5xl text-navy lg:text-6xl">
        {t.contato.titulo}
      </h1>

      <p className="mt-5 max-w-2xl font-sans text-lg font-light leading-8 text-slate-500">
        {t.contato.descricao}
      </p>

      <div className="mt-12 grid gap-16 lg:grid-cols-[2fr_1fr]">

        <ContatoForm />

        <aside className="h-fit border-t-2 border-gold bg-white p-10 shadow-md">

          <h2 className="font-display text-2xl text-navy">
            {t.contato.outrosCanais}
          </h2>

          <div className="mt-6 space-y-4 text-slate-600">

            {whatsapp && (
              <p>
                <span className="font-semibold text-slate-900">{t.contato.whatsapp}:</span>{" "}
                {whatsapp}
              </p>
            )}

            {email && (
              <p>
                <span className="font-semibold text-slate-900">{t.contato.email}:</span>{" "}
                {email}
              </p>
            )}

            {endereco && (
              <p>
                <span className="font-semibold text-slate-900">{t.contato.endereco}:</span>{" "}
                {endereco}
              </p>
            )}

          </div>

        </aside>

      </div>

    </div>
  );
}
