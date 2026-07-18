"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  fotos: string[];
}

export default function GaleriaComModal({ fotos }: Props) {
  const [aberta, setAberta] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  if (fotos.length === 0) return null;

  function abrir(index: number) {
    setIndiceAtivo(index);
    setAberta(true);
  }

  function anterior() {
    setIndiceAtivo((i) => (i === 0 ? fotos.length - 1 : i - 1));
  }

  function proxima() {
    setIndiceAtivo((i) => (i === fotos.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

        {fotos.map((foto, index) => (
          <button
            key={index}
            type="button"
            onClick={() => abrir(index)}
            className="overflow-hidden rounded-2xl transition hover:opacity-90"
          >
            <img
              src={foto}
              alt={`Foto ${index + 1}`}
              className="h-40 w-full object-cover md:h-48"
            />
          </button>
        ))}

      </div>

      {aberta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setAberta(false)}
        >

          <button
            onClick={() => setAberta(false)}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              anterior();
            }}
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-8"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <img
            src={fotos[indiceAtivo]}
            alt={`Foto ${indiceAtivo + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-[85vw] rounded-2xl object-contain"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              proxima();
            }}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-8"
            aria-label="Próxima foto"
          >
            <ChevronRight size={24} />
          </button>

          <span className="absolute bottom-6 rounded-full bg-white/10 px-4 py-2 font-sans text-sm text-white">
            {indiceAtivo + 1} / {fotos.length}
          </span>

        </div>
      )}
    </>
  );
}
