"use client";

import { useState } from "react";
import Link from "next/link";
import { BedDouble, Bath, Car, Maximize, Heart } from "lucide-react";

interface Props {
  slug: string;
  titulo: string;
  cidade: string;
  preco: string;
  imagem?: string;
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
  preco,
  imagem,
  tag,
  quartos,
  banheiros,
  vagas,
  area,
}: Props) {
  const [favorito, setFavorito] = useState(false);

  const specs = [
    { icon: BedDouble, valor: quartos },
    { icon: Bath, valor: banheiros },
    { icon: Car, valor: vagas },
    { icon: Maximize, valor: area ? `${area}m²` : null },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <Link href={`/site/imoveis/${slug}`} className="block">

        <div className="relative">

          <img
            src={imagem || "https://placehold.co/800x600"}
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

        </div>

      </Link>

      <Link href={`/site/imoveis/${slug}`} className="block">

        <div className="p-6">

          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-gold">
            {cidade}
          </p>

          <h3 className="mt-2 font-display text-2xl font-semibold text-navy">
            {titulo}
          </h3>

          {specs.length > 0 && (
            <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 font-sans text-sm text-slate-500">

              {specs.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <item.icon size={16} />
                  {item.valor}
                </span>
              ))}

            </div>
          )}

          <p className="mt-4 font-sans text-2xl font-bold text-gold">
            {preco}
          </p>

        </div>

      </Link>

    </div>
  );
}
