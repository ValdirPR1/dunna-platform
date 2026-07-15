"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Star } from "lucide-react";

import {
  listarImagens,
  salvarImagem,
  excluirImagem,
} from "../../services/imagens.service";

import { uploadImagem } from "../../services/upload.service";

type Props = {
  empreendimentoId: string;
};

export default function Gallery({
  empreendimentoId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [imagens, setImagens] = useState<any[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const lista = await listarImagens(empreendimentoId);

    setImagens(lista || []);
  }

  async function selecionarArquivo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    try {
      setLoading(true);

      for (const file of Array.from(e.target.files)) {
        const url = await uploadImagem(
          empreendimentoId,
          file
        );

        await salvarImagem(
          empreendimentoId,
          url
        );
      }

      await carregar();

    } finally {
      setLoading(false);
    }
  }

  async function remover(id: string) {
    if (!confirm("Excluir imagem?")) return;

    await excluirImagem(id);

    await carregar();
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Galeria
          </h2>

          <p className="mt-1 text-zinc-500">
            Fotos do empreendimento
          </p>

        </div>

        <>
          <input
            hidden
            multiple
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={selecionarArquivo}
          />

          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-black hover:brightness-110"
          >
            <ImagePlus size={18} />

            {loading
              ? "Enviando..."
              : "Adicionar Fotos"}
          </button>

        </>

      </div>

      {imagens.length === 0 ? (

        <div className="flex h-72 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700">

          <div className="text-center">

            <ImagePlus
              size={42}
              className="mx-auto text-zinc-500"
            />

            <p className="mt-4 text-zinc-500">
              Nenhuma imagem cadastrada
            </p>

          </div>

        </div>

      ) : (

        <div className="grid grid-cols-4 gap-6">

          {imagens.map((imagem, index) => (

            <div
              key={imagem.id}
              className="group relative overflow-hidden rounded-2xl"
            >

              <Image
                src={imagem.url}
                alt=""
                width={500}
                height={500}
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40" />

              <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">

                {index === 0 && (
                  <div className="rounded-full bg-[#C8A96A] p-2 text-black">
                    <Star size={16} />
                  </div>
                )}

                <button
                  onClick={() => remover(imagem.id)}
                  className="rounded-full bg-red-500 p-2 text-white"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}