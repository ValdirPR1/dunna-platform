import type { Metadata } from "next";
import ContatoForm from "@/features/site/components/ContatoForm";

export const metadata: Metadata = {
  title: "Fale com a gente | Dunna Imob",
  description:
    "Entre em contato com a Dunna Imob. Preencha o formulário e um de nossos especialistas te ajuda a encontrar o imóvel ideal em Porto de Galinhas, Muro Alto, Praia dos Carneiros, Tamandaré e São Miguel dos Milagres.",
  alternates: {
    canonical: "/site/contato",
  },
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        Fale com a gente
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-slate-500">
        Preencha o formulário abaixo e um de nossos especialistas
        entra em contato para te ajudar a encontrar o imóvel ideal.
      </p>

      <div className="mt-12 grid gap-16 lg:grid-cols-[2fr_1fr]">

        <ContatoForm />

        <aside className="h-fit rounded-3xl border border-slate-200 p-8 shadow-sm">

          <h2 className="text-2xl font-bold">
            Outros canais
          </h2>

          <div className="mt-6 space-y-4 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">WhatsApp:</span>{" "}
              (00) 00000-0000
            </p>
            <p>
              <span className="font-semibold text-slate-900">E-mail:</span>{" "}
              contato@dunna.com.br
            </p>
            <p>
              <span className="font-semibold text-slate-900">Endereço:</span>{" "}
              Preencha com o endereço do escritório
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
}
