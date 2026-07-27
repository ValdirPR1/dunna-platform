"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "./PropertyCard";
import { ImovelSite } from "../types/imovel";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

interface Props {
  imoveis: ImovelSite[];
}

export default function PropertyCarousel({ imoveis }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direcao: "esquerda" | "direita") {
    const el = scrollRef.current;
    if (!el) return;

    const distancia = 340;

    el.scrollBy({
      left: direcao === "direita" ? distancia : -distancia,
      behavior: "smooth",
    });
  }

  if (imoveis.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-7xl px-6">

      <button
        type="button"
        onClick={() => scroll("esquerda")}
        aria-label="Ver anteriores"
        className="absolute -left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:bg-slate-50"
      >
        <ChevronLeft size={20} className="text-navy" />
      </button>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none" }}
      >

        {imoveis.map((imovel) => (

          <div key={imovel.id} className="w-[320px] shrink-0 snap-start">

            <PropertyCard
              slug={imovel.slug}
              titulo={imovel.titulo}
              cidade={imovel.cidade}
              bairro={imovel.bairro}
              preco={formatarPreco(imovel.preco)}
              imagem={imovel.foto_capa ?? undefined}
              fotos={imovel.fotos}
              tag={imovel.selo ?? undefined}
              tipo={imovel.tipo}
              quartos={imovel.quartos}
              banheiros={imovel.banheiros}
              vagas={imovel.vagas}
              area={imovel.area_privativa}
            />

          </div>

        ))}

      </div>

      <button
        type="button"
        onClick={() => scroll("direita")}
        aria-label="Ver próximos"
        className="absolute -right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:bg-slate-50"
      >
        <ChevronRight size={20} className="text-navy" />
      </button>

    </div>
  );
}
