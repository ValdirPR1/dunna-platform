"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { ImovelSite } from "../types/imovel";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";

function formatarPrecoResumido(valor: number) {
  if (valor >= 1_000_000) {
    return `R$ ${(valor / 1_000_000).toFixed(1).replace(".0", "")}mi`;
  }
  if (valor >= 1_000) {
    return `R$ ${Math.round(valor / 1000)}mil`;
  }
  return `R$ ${valor}`;
}

function criarIconePreco(valor: number, ativo: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background: ${ativo ? "#101828" : "#ffffff"};
      color: ${ativo ? "#ffffff" : "#101828"};
      border: 1.5px solid ${ativo ? "#101828" : "#e2e8f0"};
      padding: 6px 12px;
      border-radius: 999px;
      font-family: sans-serif;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    ">${formatarPrecoResumido(valor)}</div>`,
    iconSize: undefined,
    iconAnchor: [30, 15],
  });
}

interface Props {
  imoveis: ImovelSite[];
}

export default function MapaImoveis({ imoveis }: Props) {
  const [imovelAtivo, setImovelAtivo] = useState<string | null>(null);

  const comCoordenadas = imoveis.filter(
    (i) => i.latitude != null && i.longitude != null
  );

  if (comCoordenadas.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-2xl bg-slate-50">
        <p className="font-sans text-slate-400">
          Nenhum imóvel com localização cadastrada ainda.
        </p>
      </div>
    );
  }

  const centro: [number, number] = [
    comCoordenadas.reduce((acc, i) => acc + (i.latitude ?? 0), 0) /
      comCoordenadas.length,
    comCoordenadas.reduce((acc, i) => acc + (i.longitude ?? 0), 0) /
      comCoordenadas.length,
  ];

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={centro}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {comCoordenadas.map((imovel) => (
          <Marker
            key={imovel.id}
            position={[imovel.latitude!, imovel.longitude!]}
            icon={criarIconePreco(imovel.preco, imovelAtivo === imovel.id)}
            eventHandlers={{
              click: () => setImovelAtivo(imovel.id),
              popupclose: () => setImovelAtivo(null),
            }}
          >
            <Popup minWidth={220} closeButton={false}>
              <Link href={`/site/imoveis/${imovel.slug}`} className="block">

                {imovel.foto_capa && (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={imovel.foto_capa}
                      alt={imovel.titulo}
                      fill
                      sizes="220px"
                      className="object-cover"
                      unoptimized={SEM_OTIMIZACAO_IMAGEM}
                    />
                  </div>
                )}

                <p className="mt-2 font-sans text-sm font-bold text-navy">
                  {imovel.titulo}
                </p>

                <p className="font-sans text-xs text-slate-500">
                  {imovel.bairro ? `${imovel.bairro}, ` : ""}
                  {imovel.cidade}
                </p>

                <p className="mt-1 font-sans text-sm font-bold text-gold">
                  {imovel.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 0,
                  })}
                </p>

              </Link>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
