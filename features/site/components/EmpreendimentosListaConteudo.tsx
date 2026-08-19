"use client";

import Link from "next/link";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import { EmpreendimentoSite } from "../types/empreendimento";

interface Props {
  empreendimentos: EmpreendimentoSite[];
}

export default function EmpreendimentosListaConteudo({ empreendimentos }: Props) {
  const { t } = useIdioma();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        {t.empreendimentosPagina.titulo}
      </h1>

      {empreendimentos.length === 0 && (
        <p className="mt-8 text-slate-500">
          {t.empreendimentosPagina.nenhumPublicado}
        </p>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-3">

        {empreendimentos.map((item) => (

          <Link
            key={item.id}
            href={`/site/empreendimentos/${item.slug}`}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
          >
            <div
              className="mb-6 h-56 rounded-2xl bg-slate-200 bg-cover bg-center"
              style={
                item.fotoCapa
                  ? { backgroundImage: `url(${item.fotoCapa})` }
                  : undefined
              }
            />

            <h2 className="break-words font-display text-2xl font-bold text-navy">
              {item.nome}
            </h2>

            <p className="mt-3 text-slate-500">
              {item.bairro && item.bairro !== "VAZIO" ? `${item.bairro}, ` : ""}
              {item.cidade && item.cidade !== "VAZIO" ? item.cidade : ""}
            </p>

          </Link>

        ))}

      </div>
    </div>
  );
}
