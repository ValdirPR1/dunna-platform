"use client";

export default function Units() {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Unidades
          </h2>

          <p className="mt-1 text-zinc-500">
            Unidades cadastradas neste empreendimento.
          </p>
        </div>

        <button className="rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-black hover:brightness-110">
          Nova Unidade
        </button>

      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800">

        <table className="w-full">

          <thead className="bg-zinc-800">

            <tr>

              <th className="px-5 py-4 text-left">Número</th>
              <th className="px-5 py-4 text-left">Área</th>
              <th className="px-5 py-4 text-left">Quartos</th>
              <th className="px-5 py-4 text-left">Preço</th>
              <th className="px-5 py-4 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td
                colSpan={5}
                className="py-16 text-center text-zinc-500"
              >
                Nenhuma unidade cadastrada.
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </section>
  );
}