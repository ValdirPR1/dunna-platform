"use client";

export default function Location() {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          Localização
        </h2>

        <p className="mt-2 text-zinc-500">
          Mapa do empreendimento.
        </p>

      </div>

      <div className="flex h-80 items-center justify-center rounded-2xl bg-zinc-800">

        Google Maps

      </div>

    </section>
  );
}