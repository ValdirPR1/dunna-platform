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
    <div className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {t.contato.titulo}
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-slate-500">
        {t.contato.descricao}
      </p>

      <div className="mt-12 grid gap-16 lg:grid-cols-[2fr_1fr]">

        <ContatoForm />

        <aside className="h-fit rounded-3xl border border-slate-200 p-8 shadow-sm">

          <h2 className="text-2xl font-bold">
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
