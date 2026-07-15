export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B0B0D]">

      <div className="mx-auto flex min-h-[90vh] max-w-7xl items-center px-8">

        <div className="max-w-3xl">

          <span className="rounded-full bg-[#C8A96A]/10 px-5 py-2 text-sm font-medium text-[#C8A96A]">

            DUNNA IMOB

          </span>

          <h1 className="mt-8 text-7xl font-bold leading-tight text-white">

            Especialistas em imóveis de praia.

          </h1>

          <p className="mt-8 text-2xl leading-10 text-zinc-400">

            Porto de Galinhas, Carneiros,
            Tamandaré, Muro Alto e Milagres.

          </p>

          <div className="mt-12 flex gap-5">

            <button className="rounded-2xl bg-[#C8A96A] px-10 py-5 font-semibold text-black">

              Ver Empreendimentos

            </button>

            <button className="rounded-2xl border border-zinc-700 px-10 py-5 text-white">

              Falar com Consultor

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}