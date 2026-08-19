"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";
import { useIdiomaOpcional } from "@/features/idioma/IdiomaContext";

const TEXTOS_PADRAO = {
  fechar: "Fechar",
  fotoAnterior: "Foto anterior",
  proximaFoto: "Próxima foto",
  maisFotos: "fotos",
};

interface Props {
  fotos: string[];
  // Nome do imóvel/empreendimento, usado pra montar um texto
  // alternativo descritivo em cada foto (bom pra acessibilidade e
  // ajuda a aparecer no Google Imagens, em vez de "Foto 1", "Foto 2").
  titulo?: string;
}

const MINIATURAS_VISIVEIS = 3;

export default function GaleriaComModal({ fotos, titulo }: Props) {
  const contextoIdioma = useIdiomaOpcional();
  const t = contextoIdioma?.t.galeria ?? TEXTOS_PADRAO;
  const [aberta, setAberta] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  // Pré-carrega a foto anterior e a próxima, pra navegação ficar instantânea
  useEffect(() => {
    if (!aberta || fotos.length <= 1) return;

    const anteriorIndex =
      indiceAtivo === 0 ? fotos.length - 1 : indiceAtivo - 1;
    const proximoIndex =
      indiceAtivo === fotos.length - 1 ? 0 : indiceAtivo + 1;

    [fotos[anteriorIndex], fotos[proximoIndex]].forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, [aberta, indiceAtivo, fotos]);

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

  const miniaturas = fotos.slice(0, MINIATURAS_VISIVEIS);
  const restantes = fotos.length - MINIATURAS_VISIVEIS;

  function altDaFoto(index: number) {
    return titulo ? `${titulo} - foto ${index + 1}` : `Foto ${index + 1}`;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">

        {miniaturas.map((foto, index) => {
          const ehUltima = index === MINIATURAS_VISIVEIS - 1;
          const temMais = ehUltima && restantes > 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => abrir(index)}
              className="group relative h-40 overflow-hidden rounded-2xl md:h-48"
            >
              <Image
                src={foto}
                alt={altDaFoto(index)}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                unoptimized={SEM_OTIMIZACAO_IMAGEM}
              />

              {temMais && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-white">
                  <Images size={22} />
                  <span className="font-sans text-sm font-semibold">
                    +{restantes} {t.maisFotos}
                  </span>
                </div>
              )}
            </button>
          );
        })}

      </div>

      {aberta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-md"
          onClick={() => setAberta(false)}
        >

          <button
            onClick={() => setAberta(false)}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
            aria-label={t.fechar}
          >
            <X size={22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              anterior();
            }}
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 md:left-8"
            aria-label={t.fotoAnterior}
          >
            <ChevronLeft size={24} />
          </button>

          <img
            src={fotos[indiceAtivo]}
            alt={altDaFoto(indiceAtivo)}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-[85vw] rounded-2xl object-contain"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              proxima();
            }}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20 md:right-8"
            aria-label={t.proximaFoto}
          >
            <ChevronRight size={24} />
          </button>

          <span className="absolute bottom-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-sm text-white backdrop-blur-xl">
            {indiceAtivo + 1} / {fotos.length}
          </span>

        </div>
      )}
    </>
  );
}
