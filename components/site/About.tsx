export default function About() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">

        <div>

          <span className="font-sans font-semibold text-gold">
            SOBRE A DUNNA
          </span>

          <h2 className="mt-4 break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
            Especialistas em imóveis de praia.
          </h2>

          <p className="mt-8 font-sans text-lg leading-9 text-slate-600">
            Há mais de 10 anos conectamos pessoas aos melhores
            empreendimentos do litoral pernambucano.

            Atuamos em Porto de Galinhas,
            Muro Alto,
            Praia dos Carneiros,
            Tamandaré
            e São Miguel dos Milagres.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-8">

            <div>

              <h3 className="font-display text-3xl font-bold text-gold sm:text-4xl">
                +10
              </h3>

              <p className="mt-2 font-sans text-slate-500">
                anos de experiência
              </p>

            </div>

            <div>

              <h3 className="font-display text-3xl font-bold text-gold sm:text-4xl">
                +500
              </h3>

              <p className="mt-2 font-sans text-slate-500">
                imóveis comercializados
              </p>

            </div>

          </div>

        </div>

        <div
          className="min-h-[420px] rounded-3xl bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80')",
          }}
        />

      </div>

    </section>
  );
}
