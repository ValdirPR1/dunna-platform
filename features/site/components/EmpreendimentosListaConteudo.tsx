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
    <div className="mx-auto max-w-7xl px-6 py-20">
      <span className="rotulo-luxo flex items-center text-gold-dark">
        <span className="fio-luxo" />
        {t.lancamentos.tag}
      </span>

      <h1 className="mt-5 break-words font-display text-5xl text-navy lg:text-6xl">
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
            className="zoom-luxo group bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className="mb-6 h-64 bg-slate-200 bg-cover bg-center"
              style={
                item.fotoCapa
                  ? { backgroundImage: `url(${item.fotoCapa})` }
                  : undefined
              }
            />

            <h2 className="break-words font-display text-2xl font-normal text-navy">
              {item.nome}
            </h2>

            <p className="rotulo-luxo mt-3 text-gold-dark">
              {item.bairro && item.bairro !== "VAZIO" ? `${item.bairro}, ` : ""}
              {item.cidade && item.cidade !== "VAZIO" ? item.cidade : ""}
            </p>

          </Link>

        ))}

      </div>
    </div>
  );
}
