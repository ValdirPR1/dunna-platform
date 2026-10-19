"use client";

import { useState, ReactNode } from "react";
import dynamic from "next/dynamic";
import { List, Map as MapIcon } from "lucide-react";
import { ImovelSite } from "../types/imovel";

// O Leaflet só funciona no navegador (usa `window`), por isso o mapa
// precisa ser carregado sem renderização no servidor
const MapaImoveis = dynamic(() => import("./MapaImoveis"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center rounded-2xl bg-slate-50">
      <p className="font-sans text-slate-400">Carregando mapa...</p>
    </div>
  ),
});

interface Props {
  imoveis: ImovelSite[];
  children: ReactNode;
}

export default function BuscaImoveisComMapa({ imoveis, children }: Props) {
  const [modo, setModo] = useState<"lista" | "mapa">("lista");

  return (
    <div>

      <div className="mb-8 flex justify-end">

        <div className="inline-flex border border-slate-200 bg-white p-1">

          <button
            onClick={() => setModo("lista")}
            className={`rotulo-luxo flex items-center gap-2 px-5 py-3 transition ${
              modo === "lista"
                ? "bg-navy text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <List size={16} />
            Lista
          </button>

          <button
            onClick={() => setModo("mapa")}
            className={`rotulo-luxo flex items-center gap-2 px-5 py-3 transition ${
              modo === "mapa"
                ? "bg-navy text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <MapIcon size={16} />
            Mapa
          </button>

        </div>

      </div>

      {modo === "lista" ? children : <MapaImoveis imoveis={imoveis} />}

    </div>
  );
}
