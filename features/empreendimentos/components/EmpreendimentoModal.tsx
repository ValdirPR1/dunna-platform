"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EmpreendimentoModal({
  open,
  onClose,
}: Props) {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [construtora, setConstrutora] = useState("");

  if (!open) return null;

  function salvar() {
    console.log({
      nome,
      cidade,
      bairro,
      construtora,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Novo Empreendimento
            </h2>

            <p className="mt-2 text-zinc-500">
              Cadastre um novo empreendimento.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
          >
            Fechar
          </button>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white"
          />

          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white"
          />

          <input
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro"
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white"
          />

          <input
            value={construtora}
            onChange={(e) => setConstrutora(e.target.value)}
            placeholder="Construtora"
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white"
          />

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-6 py-3"
          >
            Cancelar
          </button>

          <button
            onClick={salvar}
            className="rounded-xl bg-[#C8A96A] px-8 py-3 font-semibold text-black hover:brightness-110"
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}