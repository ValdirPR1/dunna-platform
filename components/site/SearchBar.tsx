"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const [regiao, setRegiao] = useState("");
  const [tipo, setTipo] = useState("");
  const [quartos, setQuartos] = useState("");
  const [valor, setValor] = useState("");

  function handleBuscar() {
    const params = new URLSearchParams();

    if (regiao) params.set("regiao", regiao);
    if (tipo) params.set("tipo", tipo);
    if (quartos) params.set("quartos", quartos);
    if (valor) params.set("valor", valor);

    router.push(`/site/imoveis?${params.toString()}`);
  }

  return (
    <section className="relative z-20 -mt-14 mx-auto max-w-7xl px-6">

      <div className="rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Encontre seu imóvel ideal
        </h2>

        <div className="grid gap-4 md:grid-cols-5">

          <select
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">Região</option>
            <option value="porto-de-galinhas">Porto de Galinhas</option>
            <option value="muro-alto">Muro Alto</option>
            <option value="praia-dos-carneiros">Praia dos Carneiros</option>
            <option value="tamandare">Tamandaré</option>
            <option value="milagres">Milagres</option>
          </select>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">Tipo</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Studio">Studio</option>
            <option value="Flat">Flat</option>
          </select>

          <select
            value={quartos}
            onChange={(e) => setQuartos(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">Quartos</option>
            <option value="1">1 Quarto</option>
            <option value="2">2 Quartos</option>
            <option value="3">3 Quartos</option>
            <option value="4">4+</option>
          </select>

          <select
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">Valor</option>
            <option value="0-300000">Até R$300 mil</option>
            <option value="300000-500000">R$300 a R$500 mil</option>
            <option value="500000-800000">R$500 a R$800 mil</option>
            <option value="800000-">Acima de R$800 mil</option>
          </select>

          <button
            onClick={handleBuscar}
            className="rounded-xl bg-[#C8A96A] px-6 py-4 font-semibold text-white transition hover:opacity-90"
          >
            Buscar
          </button>

        </div>

      </div>

    </section>
  );
}
