"use client";

export default function SearchBar() {
  return (
    <section className="relative z-20 -mt-14 mx-auto max-w-7xl px-6">

      <div className="rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Encontre seu imóvel ideal
        </h2>

        <div className="grid gap-4 md:grid-cols-5">

          <select className="rounded-xl border border-slate-200 p-4">
            <option>Região</option>
            <option>Porto de Galinhas</option>
            <option>Muro Alto</option>
            <option>Praia dos Carneiros</option>
            <option>Tamandaré</option>
            <option>Milagres</option>
          </select>

          <select className="rounded-xl border border-slate-200 p-4">
            <option>Tipo</option>
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Studio</option>
            <option>Flat</option>
          </select>

          <select className="rounded-xl border border-slate-200 p-4">
            <option>Quartos</option>
            <option>1 Quarto</option>
            <option>2 Quartos</option>
            <option>3 Quartos</option>
            <option>4+</option>
          </select>

          <select className="rounded-xl border border-slate-200 p-4">
            <option>Valor</option>
            <option>Até R$300 mil</option>
            <option>R$300 a R$500 mil</option>
            <option>R$500 a R$800 mil</option>
            <option>Acima de R$800 mil</option>
          </select>

          <button className="rounded-xl bg-[#C8A96A] px-6 py-4 font-semibold text-white transition hover:opacity-90">
            Buscar
          </button>

        </div>

      </div>

    </section>
  );
}