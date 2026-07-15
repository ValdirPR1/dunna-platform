"use client";

export default function Timeline() {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <h2 className="mb-8 text-2xl font-bold">
        Timeline da Obra
      </h2>

      <div className="space-y-6">

        <div className="rounded-xl border border-zinc-800 p-5">
          <h3 className="font-semibold">
            Fundação
          </h3>

          <p className="text-zinc-500">
            Ainda não cadastrada.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 p-5">
          <h3 className="font-semibold">
            Estrutura
          </h3>

          <p className="text-zinc-500">
            Ainda não cadastrada.
          </p>
        </div>

      </div>

    </section>
  );
}