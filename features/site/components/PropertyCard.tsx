"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";
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
  tipo?: string | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  area?: number | null;
  // Marca o card como prioritário pro navegador carregar a foto sem
  // esperar (usado só no primeiro card visível de uma listagem, que
  // normalmente é o elemento LCP da página — os outros continuam
  // carregando sob demanda, senão todo mundo competiria por banda ao
  // mesmo tempo e pioraria o carregamento em vez de ajudar).
  prioridade?: boolean;
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
  tipo,
  quartos,
  banheiros,
  vagas,
  area,
  prioridade,
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
    <div className="group/card overflow-hidden bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">

      <Link href={`/site/imoveis/${slug}`} className="block">

        <div className="group relative h-80 w-full overflow-hidden">

          <Image
            src={galeria[fotoAtiva]}
            alt={titulo}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover/card:scale-105"
            unoptimized={SEM_OTIMIZACAO_IMAGEM}
            priority={prioridade}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          {(tag || tipo) && (
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {tag && (
                <span className="rotulo-luxo bg-gold px-3 py-1.5 text-white">
                  {tag}
                </span>
              )}

              {tipo && (
                <span className="rotulo-luxo bg-white/90 px-3 py-1.5 text-navy">
                  {tipo}
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setFavorito((v) => !v);
            }}
            aria-label="Favoritar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
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

        <div className="p-7">

          <p className="rotulo-luxo text-gold-dark">
            {bairro || cidade}
          </p>

          <h3 className="mt-3 line-clamp-2 font-display text-xl font-normal leading-snug text-navy">
            {titulo}
          </h3>

          {specs.length > 0 && (
            <div className="mt-5 flex items-center gap-5 border-t border-slate-200 pt-5 font-sans text-sm font-light text-slate-500">

              {specs.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <item.icon size={15} />
                  {item.valor}
                </span>
              ))}

            </div>
          )}

          <p className="mt-5 font-display text-2xl font-light text-navy">
            {preco}
          </p>

        </div>

      </Link>

    </div>
  );
}
