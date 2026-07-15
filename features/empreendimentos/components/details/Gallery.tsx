"use client";

import { useEffect, useRef, useState } from "react";
import {
  listarImagens,
  uploadImagem,
} from "../../services/imagens.service";

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
        await uploadImagem(empreendimentoId, file);
      }

      const lista = await listarImagens(empreendimentoId);

      setImagens(lista || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Galeria
        </h2>

        <>

          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={selecionarArquivo}
          />

          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-black"
          >
            {loading ? "Enviando..." : "Adicionar Fotos"}
          </button>

        </>

      </div>

      {imagens.length === 0 ? (

        <div className="flex h-60 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 text-zinc-500">

          Nenhuma imagem cadastrada.

        </div>

      ) : (

        <div className="grid grid-cols-4 gap-5">

          {imagens.map((imagem) => (

            <img
              key={imagem.id}
              src={imagem.imagem}
              className="aspect-square rounded-2xl object-cover"
              alt=""
            />

          ))}

        </div>

      )}

    </section>
  );
}