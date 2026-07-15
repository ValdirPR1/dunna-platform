"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NovaUnidadeModal({
  open,
  onClose,
}: Props) {
  const [numero, setNumero] = useState("");
  const [andar, setAndar] = useState("");
  const [quartos, setQuartos] = useState("");
  const [area, setArea] = useState("");
  const [preco, setPreco] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-3xl rounded-3xl bg-zinc-900 border border-zinc-800 p-8">

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Nova Unidade
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-5 py-2"
          >
            Fechar
          </button>

        </div>

        <div className="mt-8 grid grid-cols-2 gap-5">

          <input
            value={numero}
            onChange={(e)=>setNumero(e.target.value)}
            placeholder="Número"
            className="rounded-xl bg-zinc-800 p-4"
          />

          <input
            value={andar}
            onChange={(e)=>setAndar(e.target.value)}
            placeholder="Andar"
            className="rounded-xl bg-zinc-800 p-4"
          />

          <input
            value={quartos}
            onChange={(e)=>setQuartos(e.target.value)}
            placeholder="Quartos"
            className="rounded-xl bg-zinc-800 p-4"
          />

          <input
            value={area}
            onChange={(e)=>setArea(e.target.value)}
            placeholder="Área"
            className="rounded-xl bg-zinc-800 p-4"
          />

          <input
            value={preco}
            onChange={(e)=>setPreco(e.target.value)}
            placeholder="Preço"
            className="col-span-2 rounded-xl bg-zinc-800 p-4"
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-6 py-3"
          >
            Cancelar
          </button>

          <button
            className="rounded-xl bg-[#C8A96A] px-8 py-3 font-semibold text-black"
          >
            Salvar Unidade
          </button>

        </div>

      </div>

    </div>
  );
}