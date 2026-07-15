"use client";

export default function Documents() {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Documentos
        </h2>

        <button className="rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-black">
          Adicionar Documento
        </button>

      </div>

      <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 text-zinc-500">

        Nenhum documento enviado.

      </div>

    </section>
  );
}