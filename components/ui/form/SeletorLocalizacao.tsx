"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { MapPin, Search } from "lucide-react";

const MiniMapaSelecionavel = dynamic(() => import("./MiniMapaSelecionavel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100">
      <p className="font-sans text-sm text-slate-400">Carregando mapa...</p>
    </div>
  ),
});

interface Props {
  enderecoParaBuscar: string;
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function SeletorLocalizacao({
  enderecoParaBuscar,
  latitude,
  longitude,
  onChange,
}: Props) {
  const [buscando, setBuscando] = useState(false);

  async function buscarNoMapa() {
    if (!enderecoParaBuscar.trim()) {
      toast.error("Preenche o endereço, bairro e cidade primeiro.");
      return;
    }

    setBuscando(true);

    try {
      const resposta = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(
          enderecoParaBuscar
        )}`
      );

      const resultados = await resposta.json();

      if (!resultados || resultados.length === 0) {
        toast.error(
          "Não encontrei esse endereço no mapa. Tenta ajustar o pino manualmente abaixo."
        );
        return;
      }

      onChange(Number(resultados[0].lat), Number(resultados[0].lon));
      toast.success("Localização encontrada! Confere se o pino ficou no lugar certo.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível buscar esse endereço agora.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div>

      <button
        type="button"
        onClick={buscarNoMapa}
        disabled={buscando}
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-sans text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:opacity-60"
      >
        <Search size={16} />
        {buscando ? "Buscando..." : "Buscar endereço no mapa"}
      </button>

      <p className="mt-2 font-sans text-xs text-slate-400">
        Depois de buscar, você pode arrastar o pino no mapa abaixo pra
        ajustar a posição exata.
      </p>

      <div className="mt-4">
        <MiniMapaSelecionavel
          latitude={latitude}
          longitude={longitude}
          onChange={onChange}
        />
      </div>

      {latitude && longitude && (
        <p className="mt-2 flex items-center gap-1 font-sans text-xs text-slate-400">
          <MapPin size={12} />
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      )}

    </div>
  );
}
