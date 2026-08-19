"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function SearchBar() {
  const router = useRouter();
  const { t } = useIdioma();

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
          {t.searchbar.titulo}
        </h2>

        <div className="grid gap-4 md:grid-cols-5">

          <select
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">{t.searchbar.regiao}</option>
            <option value="porto-de-galinhas">{t.searchbar.regioes["porto-de-galinhas"]}</option>
            <option value="muro-alto">{t.searchbar.regioes["muro-alto"]}</option>
            <option value="praia-dos-carneiros">{t.searchbar.regioes["praia-dos-carneiros"]}</option>
            <option value="tamandare">{t.searchbar.regioes.tamandare}</option>
            <option value="milagres">{t.searchbar.regioes.milagres}</option>
          </select>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">{t.searchbar.tipo}</option>
            <option value="Apartamento">{t.searchbar.tipos.Apartamento}</option>
            <option value="Casa">{t.searchbar.tipos.Casa}</option>
            <option value="Studio">{t.searchbar.tipos.Studio}</option>
            <option value="Flat">{t.searchbar.tipos.Flat}</option>
          </select>

          <select
            value={quartos}
            onChange={(e) => setQuartos(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">{t.searchbar.quartos}</option>
            <option value="1">{t.searchbar.opcoesQuartos[0]}</option>
            <option value="2">{t.searchbar.opcoesQuartos[1]}</option>
            <option value="3">{t.searchbar.opcoesQuartos[2]}</option>
            <option value="4">{t.searchbar.opcoesQuartos[3]}</option>
          </select>

          <select
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="rounded-xl border border-slate-200 p-4"
          >
            <option value="">{t.searchbar.valor}</option>
            <option value="0-300000">{t.searchbar.opcoesValor[0]}</option>
            <option value="300000-500000">{t.searchbar.opcoesValor[1]}</option>
            <option value="500000-800000">{t.searchbar.opcoesValor[2]}</option>
            <option value="800000-">{t.searchbar.opcoesValor[3]}</option>
          </select>

          <button
            onClick={handleBuscar}
            className="rounded-xl bg-[#C8A96A] px-6 py-4 font-semibold text-white transition hover:opacity-90"
          >
            {t.searchbar.buscar}
          </button>

        </div>

      </div>

    </section>
  );
}
