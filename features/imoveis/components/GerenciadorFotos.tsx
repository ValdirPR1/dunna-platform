"use client";

import { Star, Trash2, ChevronLeft, ChevronRight, Upload } from "lucide-react";

export interface ItemFoto {
  key: string;
  url: string;
  file?: File;
  existingId?: string;
}

interface Props {
  itens: ItemFoto[];
  capaKey: string | null;
  onAdicionar: (arquivos: FileList | null) => void;
  onSetCapa: (key: string) => void;
  onMover: (key: string, direcao: "esquerda" | "direita") => void;
  onRemover: (key: string) => void;
}

export default function GerenciadorFotos({
  itens,
  capaKey,
  onAdicionar,
  onSetCapa,
  onMover,
  onRemover,
}: Props) {
  return (
    <div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-8 font-sans text-slate-500 transition hover:border-gold hover:text-gold">
        <Upload size={20} />
        Clique para escolher as fotos
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onAdicionar(e.target.files)}
        />
      </label>

      {itens.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-5">

          {itens.map((item, index) => {
            const ehCapa = item.key === capaKey;

            return (
              <div
                key={item.key}
                className="group relative overflow-hidden rounded-2xl border border-slate-200"
              >

                <img
                  src={item.url}
                  alt={`Foto ${index + 1}`}
                  className="h-48 w-full object-cover"
                />

                {ehCapa && (
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-white">
                    Capa
                  </span>
                )}

                <div className="absolute inset-0 flex flex-col justify-between bg-navy/0 p-2 opacity-0 transition group-hover:bg-navy/40 group-hover:opacity-100">

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onRemover(item.key)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
                      aria-label="Remover foto"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMover(item.key, "esquerda")}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow disabled:opacity-40"
                      aria-label="Mover para a esquerda"
                    >
                      <ChevronLeft size={16} className="text-navy" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSetCapa(item.key)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow"
                      aria-label="Definir como capa"
                    >
                      <Star
                        size={16}
                        className={ehCapa ? "fill-gold text-gold" : "text-slate-400"}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={index === itens.length - 1}
                      onClick={() => onMover(item.key, "direita")}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow disabled:opacity-40"
                      aria-label="Mover para a direita"
                    >
                      <ChevronRight size={16} className="text-navy" />
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
