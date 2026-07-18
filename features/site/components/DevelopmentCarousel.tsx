"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DevelopmentCard from "./DevelopmentCard";
import { EmpreendimentoSite } from "../types/empreendimento";

interface Props {
  empreendimentos: EmpreendimentoSite[];
}

export default function DevelopmentCarousel({ empreendimentos }: Props) {
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

  if (empreendimentos.length === 0) {
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

        {empreendimentos.map((item) => (

          <div key={item.id} className="w-[320px] shrink-0 snap-start">

            <DevelopmentCard
              slug={item.slug}
              nome={item.nome}
              cidade={
                item.cidade && item.cidade !== "VAZIO" ? item.cidade : ""
              }
              status={item.status}
              imagem={item.fotoCapa}
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
