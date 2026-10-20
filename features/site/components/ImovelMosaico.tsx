"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Car, Maximize, Heart } from "lucide-react";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";
import { ImovelSite } from "../types/imovel";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function CartaoMosaico({
  imovel,
  grande,
  prioridade,
}: {
  imovel: ImovelSite;
  grande: boolean;
  prioridade: boolean;
}) {
  const [favorito, setFavorito] = useState(false);

  const foto =
    imovel.foto_capa ||
    (imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : null) ||
    "https://placehold.co/1200x900";

  const specs = [
    { icon: BedDouble, valor: imovel.suites ?? imovel.quartos, sufixo: "" },
    { icon: Bath, valor: imovel.banheiros, sufixo: "" },
    { icon: Car, valor: imovel.vagas, sufixo: "" },
    {
      icon: Maximize,
      valor: imovel.area_privativa ? `${imovel.area_privativa}m²` : null,
      sufixo: "",
    },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  return (
    <div className="group relative min-h-[400px] overflow-hidden bg-gradient-to-br from-[#d9cfc2] via-[#c9bcab] to-[#b8a88f] shadow-sm">

      <Link
        href={`/site/imoveis/${imovel.slug}`}
        aria-label={imovel.titulo}
        className="absolute inset-0 z-10"
      />

      <Image
        src={foto}
        alt={imovel.titulo}
        fill
        sizes={grande ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        unoptimized={SEM_OTIMIZACAO_IMAGEM}
        priority={prioridade}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

      {/* Degradê escuro com toque dourado que surge ao passar o mouse */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#1c1a17]/65 to-gold-dark/35 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />

      {(imovel.selo || imovel.tipo) && (
        <div className="absolute left-5 top-5 z-20 flex flex-wrap gap-2">
          {imovel.selo && (
            <span className="rotulo-luxo bg-gold px-3 py-1.5 text-white">
              {imovel.selo}
            </span>
          )}
          {imovel.tipo && (
            <span className="rotulo-luxo bg-white/90 px-3 py-1.5 text-navy">
              {imovel.tipo}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setFavorito((v) => !v)}
        aria-label="Favoritar"
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
      >
        <Heart
          size={18}
          className={favorito ? "fill-gold text-gold" : "text-slate-500"}
        />
      </button>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">

        <p className="rotulo-luxo text-white/75">
          {imovel.bairro || imovel.cidade}
        </p>

        <h3
          className={`mt-3 line-clamp-2 font-display text-xl font-light leading-snug text-white sm:text-2xl ${
            grande ? "md:text-4xl" : ""
          }`}
        >
          {imovel.titulo}
        </h3>

        {specs.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-sm font-light text-white/80">
            {specs.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <item.icon size={15} />
                {item.valor}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-white/20 pt-4">
          <p
            className={`font-display text-2xl font-light text-white ${
              grande ? "md:text-3xl" : ""
            }`}
          >
            {formatarPreco(imovel.preco)}
          </p>
        </div>

      </div>

    </div>
  );
}

// Grade em mosaico: a cada 3 imóveis, um grande (2/3 da largura) e dois
// menores empilhados ao lado — e a próxima trinca inverte o lado. Os
// textos ficam sobre a foto. No celular vira uma coluna só. As posições
// são definidas em site.css (.mosaico).
export default function ImovelMosaico({
  imoveis,
  uniforme = false,
}: {
  imoveis: ImovelSite[];
  uniforme?: boolean;
}) {
  if (imoveis.length === 0) return null;

  // Modo uniforme: 2 colunas, todos os cartões do mesmo tamanho
  if (uniforme) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        {imoveis.map((imovel, i) => (
          <div key={imovel.id} className="flex">
            <div className="w-full [&>div]:min-h-[440px]">
              <CartaoMosaico imovel={imovel} grande={false} prioridade={i < 2} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mosaico">
      {imoveis.map((imovel, i) => (
        <CartaoMosaico
          key={imovel.id}
          imovel={imovel}
          grande={i % 6 === 0 || i % 6 === 5}
          prioridade={i === 0}
        />
      ))}
    </div>
  );
}
