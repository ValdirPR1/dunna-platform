"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Planta {
  id: string;
  tipologia: string;
  area: number | null;
  preco_a_partir: number | null;
  imagem_url: string;
  fotos: string[];
}

interface Props {
  plantas: Planta[];
}

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function PlantasGaleria({ plantas }: Props) {
  const [plantaAberta, setPlantaAberta] = useState<Planta | null>(null);
  const [fotoAtiva, setFotoAtiva] = useState(0);

  function abrir(planta: Planta) {
    setPlantaAberta(planta);
    setFotoAtiva(0);
  }

  function anterior() {
    if (!plantaAberta) return;
    setFotoAtiva((i) =>
      i === 0 ? plantaAberta.fotos.length - 1 : i - 1
    );
  }

  function proxima() {
    if (!plantaAberta) return;
    setFotoAtiva((i) =>
      i === plantaAberta.fotos.length - 1 ? 0 : i + 1
    );
  }

  // Pré-carrega a foto anterior e a próxima, pra navegação ficar instantânea
  useEffect(() => {
    if (!plantaAberta || plantaAberta.fotos.length <= 1) return;

    const anteriorIndex =
      fotoAtiva === 0 ? plantaAberta.fotos.length - 1 : fotoAtiva - 1;
    const proximoIndex =
      fotoAtiva === plantaAberta.fotos.length - 1 ? 0 : fotoAtiva + 1;

    [
      plantaAberta.fotos[anteriorIndex],
      plantaAberta.fotos[proximoIndex],
    ].forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, [plantaAberta, fotoAtiva]);

  return (
    <>
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {plantas.map((planta) => (
          <button
            key={planta.id}
            type="button"
            onClick={() => abrir(planta)}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <div className="relative">

              <img
                src={planta.imagem_url}
                alt={planta.tipologia}
                className="h-56 w-full object-cover"
              />

              {planta.fotos.length > 1 && (
                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 font-sans text-xs font-semibold text-white">
                  +{planta.fotos.length - 1} fotos
                </span>
              )}

            </div>

            <div className="p-6">

              <h3 className="text-xl font-bold">
                {planta.tipologia}
              </h3>

              <p className="mt-2 font-sans text-slate-500">
                {planta.area ? `${planta.area}m²` : ""}
              </p>

              {planta.preco_a_partir && (
                <p className="mt-3 font-sans text-lg font-bold text-[#C8A96A]">
                  A partir de {formatarPreco(planta.preco_a_partir)}
                </p>
              )}

            </div>

          </button>
        ))}

      </div>

      {plantaAberta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-md"
          onClick={() => setPlantaAberta(null)}
        >

          <button
            onClick={() => setPlantaAberta(null)}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>

          {plantaAberta.fotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                anterior();
              }}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 md:left-8"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[85vw] rounded-2xl bg-white p-4"
          >

            <img
              src={plantaAberta.fotos[fotoAtiva]}
              alt={plantaAberta.tipologia}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />

            <div className="mt-4 flex items-center justify-between px-2">

              <div>
                <h3 className="text-xl font-bold text-navy">
                  {plantaAberta.tipologia}
                </h3>

                <p className="mt-1 font-sans text-slate-500">
                  {plantaAberta.area ? `${plantaAberta.area}m²` : ""}
                  {plantaAberta.preco_a_partir
                    ? ` • A partir de ${formatarPreco(plantaAberta.preco_a_partir)}`
                    : ""}
                </p>
              </div>

              {plantaAberta.fotos.length > 1 && (
                <span className="font-sans text-sm text-slate-400">
                  {fotoAtiva + 1} / {plantaAberta.fotos.length}
                </span>
              )}

            </div>

          </div>

          {plantaAberta.fotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                proxima();
              }}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 md:right-8"
              aria-label="Próxima foto"
            >
              <ChevronRight size={24} />
            </button>
          )}

        </div>
      )}
    </>
  );
}
