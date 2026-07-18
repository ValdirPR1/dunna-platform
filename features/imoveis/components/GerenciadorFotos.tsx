"use client";

import { useState } from "react";
import { Star, Trash2, GripVertical, Upload } from "lucide-react";

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
  onReordenar: (novaOrdem: ItemFoto[]) => void;
  onRemover: (key: string) => void;
}

export default function GerenciadorFotos({
  itens,
  capaKey,
  onAdicionar,
  onSetCapa,
  onReordenar,
  onRemover,
}: Props) {
  const [arrastandoIndex, setArrastandoIndex] = useState<number | null>(null);
  const [sobreIndex, setSobreIndex] = useState<number | null>(null);

  function handleDrop(indexDestino: number) {
    if (arrastandoIndex === null || arrastandoIndex === indexDestino) {
      setArrastandoIndex(null);
      setSobreIndex(null);
      return;
    }

    const copia = [...itens];
    const [arrastada] = copia.splice(arrastandoIndex, 1);
    copia.splice(indexDestino, 0, arrastada);

    onReordenar(copia);
    setArrastandoIndex(null);
    setSobreIndex(null);
  }

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

      {itens.length > 1 && (
        <p className="mt-3 font-sans text-xs text-slate-400">
          Dica: arraste as fotos pra reordenar, ou clique e segure numa
          delas e arraste até o lugar desejado.
        </p>
      )}

      {itens.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-5">

          {itens.map((item, index) => {
            const ehCapa = item.key === capaKey;
            const estaSendoArrastada = arrastandoIndex === index;
            const estaRecebendo = sobreIndex === index && !estaSendoArrastada;

            return (
              <div
                key={item.key}
                draggable
                onDragStart={() => setArrastandoIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setSobreIndex(index);
                }}
                onDragLeave={() => setSobreIndex(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(index);
                }}
                onDragEnd={() => {
                  setArrastandoIndex(null);
                  setSobreIndex(null);
                }}
                className={`group relative cursor-grab overflow-hidden rounded-2xl border-2 transition active:cursor-grabbing ${
                  estaRecebendo
                    ? "border-gold"
                    : "border-slate-200"
                } ${estaSendoArrastada ? "opacity-40" : "opacity-100"}`}
              >

                <img
                  src={item.url}
                  alt={`Foto ${index + 1}`}
                  className="h-48 w-full object-cover"
                  draggable={false}
                />

                <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-500 opacity-0 shadow transition group-hover:opacity-100">
                  <GripVertical size={14} />
                </div>

                {ehCapa && (
                  <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-white">
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

                  <div className="flex justify-center">

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
