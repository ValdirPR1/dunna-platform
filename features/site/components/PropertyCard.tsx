"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Car,
  Maximize,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  slug: string;
  titulo: string;
  cidade: string;
  bairro?: string | null;
  preco: string;
  imagem?: string;
  fotos?: string[];
  tag?: string;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  area?: number | null;
}

export default function PropertyCard({
  slug,
  titulo,
  cidade,
  bairro,
  preco,
  imagem,
  fotos,
  tag,
  quartos,
  banheiros,
  vagas,
  area,
}: Props) {
  const [favorito, setFavorito] = useState(false);
  const [fotoAtiva, setFotoAtiva] = useState(0);

  const galeria =
    fotos && fotos.length > 0
      ? fotos
      : [imagem || "https://placehold.co/800x600"];

  function irParaFoto(e: React.MouseEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    setFotoAtiva(index);
  }

  function fotoAnterior(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFotoAtiva((atual) => (atual === 0 ? galeria.length - 1 : atual - 1));
  }

  function proximaFoto(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFotoAtiva((atual) => (atual === galeria.length - 1 ? 0 : atual + 1));
  }

  const specs = [
    { icon: BedDouble, valor: quartos },
    { icon: Bath, valor: banheiros },
    { icon: Car, valor: vagas },
    { icon: Maximize, valor: area ? `${area}m²` : null },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <Link href={`/site/imoveis/${slug}`} className="block">

        <div className="group relative">

          <img
            src={galeria[fotoAtiva]}
            alt={titulo}
            className="h-72 w-full object-cover"
          />

          {tag && (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-white">
              {tag}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setFavorito((v) => !v);
            }}
            aria-label="Favoritar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
          >
            <Heart
              size={18}
              className={favorito ? "fill-gold text-gold" : "text-slate-400"}
            />
          </button>

          {galeria.length > 1 && (
            <>
              <button
                type="button"
                onClick={fotoAnterior}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow-md transition group-hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={proximaFoto}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow-md transition group-hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {galeria.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => irParaFoto(e, index)}
                    aria-label={`Ver foto ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      index === fotoAtiva
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

        </div>

      </Link>

      <Link href={`/site/imoveis/${slug}`} className="block">

        <div className="p-6">

          <h3 className="font-display text-xl font-semibold text-navy">
            {titulo}
          </h3>

          <p className="mt-1.5 font-sans text-sm text-slate-500">
            {bairro || cidade}
          </p>

          {specs.length > 0 && (
            <div className="mt-4 flex items-center gap-4 font-sans text-sm text-slate-500">

              {specs.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <item.icon size={15} />
                  {item.valor}
                </span>
              ))}

            </div>
          )}

          <p className="mt-4 font-sans text-xl font-bold text-navy">
            {preco}
          </p>

        </div>

      </Link>

    </div>
  );
}
