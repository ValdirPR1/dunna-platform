"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarImoveis, listarCapasPorImoveis } from "../services/imoveis.service";
import { Imovel } from "../types/imovel";

function formatarPreco(valor: number | null) {
  if (!valor) return "—";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [capas, setCapas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarImoveis()
      .then(async (dados) => {
        setImoveis(dados);
        const capasEncontradas = await listarCapasPorImoveis(
          dados.map((i) => i.id)
        );
        setCapas(capasEncontradas);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="font-display text-2xl font-bold text-navy md:text-3xl">
            Imóveis
          </h1>

          <p className="mt-2 font-sans text-slate-500">
            Imóveis avulsos e de revenda cadastrados.
          </p>

        </div>

        <Link
          href="/imoveis/novo"
          className="rounded-xl bg-gold px-5 py-3 text-center font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          + Novo Imóvel
        </Link>

      </div>

      {loading ? (

        <p className="font-sans text-slate-400">Carregando...</p>

      ) : imoveis.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Nenhum imóvel cadastrado ainda.
          </p>
        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {imoveis.map((imovel) => (

            <Link
              key={imovel.id}
              href={`/imoveis/${imovel.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >

              {capas[imovel.id] ? (
                <img
                  src={capas[imovel.id]}
                  alt={imovel.titulo}
                  className="mb-5 h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mb-5 h-40 rounded-xl bg-slate-100" />
              )}

              <h2 className="font-display text-lg font-semibold text-navy">
                {imovel.titulo}
              </h2>

              {imovel.codigo && (
                <p className="mt-0.5 font-sans text-xs text-slate-400">
                  {imovel.codigo}
                </p>
              )}

              <p className="mt-1 font-sans text-slate-500">
                {imovel.bairro ? `${imovel.bairro}, ` : ""}
                {imovel.cidade}
              </p>

              <p className="mt-3 font-sans text-xl font-bold text-gold">
                {formatarPreco(imovel.preco)}
              </p>

              <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 font-sans text-sm font-medium text-slate-600">
                {imovel.status || (imovel.publicado ? "Publicado" : "Rascunho")}
              </span>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}
