import Link from "next/link";

const diferenciais = [
  {
    titulo: "Curadoria especializada",
    descricao:
      "Selecionamos apenas empreendimentos e imóveis com potencial real de valorização e rentabilidade.",
  },
  {
    titulo: "Acompanhamento completo",
    descricao:
      "Da primeira visita à assinatura do contrato, você tem um especialista dedicado ao seu lado.",
  },
  {
    titulo: "Conhecimento de região",
    descricao:
      "Vivemos e respiramos o litoral pernambucano — sabemos onde investir vale mais a pena.",
  },
];

const regioes = [
  "Porto de Galinhas",
  "Muro Alto",
  "Praia dos Carneiros",
  "Tamandaré",
  "São Miguel dos Milagres",
];

export default function SobrePage() {
  return (
    <div>

      {/* Hero */}

      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">

          <span className="font-semibold text-[#C8A96A]">
            SOBRE A DUNNA
          </span>

          <h1 className="mt-4 max-w-3xl break-words font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Especialistas em imóveis de praia no litoral de Pernambuco.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/80">
            Há mais de 10 anos conectamos pessoas aos melhores
            empreendimentos e imóveis do litoral pernambucano,
            unindo qualidade de vida, rentabilidade e segurança
            em cada negócio.
          </p>

        </div>
      </section>

      {/* Números */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-8 md:grid-cols-3">

          <div>
            <h2 className="font-display text-3xl font-bold text-[#C8A96A] sm:text-4xl">
              +10
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              anos de experiência
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-[#C8A96A] sm:text-4xl">
              +500
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              imóveis comercializados
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-[#C8A96A] sm:text-4xl">
              5
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              regiões de atuação
            </p>
          </div>

        </div>

      </section>

      {/* Diferenciais */}

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <span className="font-semibold text-[#C8A96A]">
            POR QUE A DUNNA
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900">
            Nossos diferenciais
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {diferenciais.map((item) => (
              <div
                key={item.titulo}
                className="rounded-3xl border border-slate-200 bg-white p-8"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {item.titulo}
                </h3>
                <p className="mt-4 text-slate-600">
                  {item.descricao}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Regiões */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <span className="font-semibold text-[#C8A96A]">
          ONDE ATUAMOS
        </span>

        <h2 className="mt-4 text-4xl font-bold text-slate-900">
          Regiões de atuação
        </h2>

        <div className="mt-8 flex flex-wrap gap-4">
          {regioes.map((regiao) => (
            <span
              key={regiao}
              className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700"
            >
              {regiao}
            </span>
          ))}
        </div>

      </section>

      {/* CTA */}

      <section className="bg-[#C8A96A] py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">

          <h2 className="text-4xl font-bold">
            Pronto para encontrar seu próximo imóvel?
          </h2>

          <p className="mt-4 text-lg text-white/90">
            Fale com um de nossos especialistas e descubra as
            melhores oportunidades do litoral pernambucano.
          </p>

          <Link
            href="/site/contato"
            className="mt-8 inline-block rounded-2xl bg-slate-900 px-8 py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            Falar com a Dunna
          </Link>

        </div>
      </section>

    </div>
  );
}
