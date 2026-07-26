import VenderImovelForm from "@/features/site/components/VenderImovelForm";
import { TrendingUp, Users, ShieldCheck, Clock } from "lucide-react";

const BENEFICIOS = [
  {
    icon: Users,
    titulo: "Rede de compradores qualificados",
    texto: "Sua oferta chega direto pra quem já está buscando um imóvel na região.",
  },
  {
    icon: TrendingUp,
    titulo: "Avaliação justa de mercado",
    texto: "Analisamos a região e imóveis parecidos pra sugerir o melhor preço.",
  },
  {
    icon: ShieldCheck,
    titulo: "Segurança em todo o processo",
    texto: "Da divulgação à assinatura do contrato, acompanhamos cada etapa.",
  },
  {
    icon: Clock,
    titulo: "Resposta rápida",
    texto: "Um de nossos corretores entra em contato em até 24h úteis.",
  },
];

export default function VenderImovelPage() {
  return (
    <div>

      {/* Hero */}

      <section className="bg-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">

          <span className="font-sans font-semibold text-gold">
            VENDA COM A DUNNA
          </span>

          <h1 className="mt-4 break-words font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Quer vender ou alugar seu imóvel?
          </h1>

          <p className="mt-5 font-sans text-lg text-white/80">
            Conta pra gente sobre o seu imóvel e um corretor especialista
            entra em contato pra te ajudar a encontrar o comprador ideal.
          </p>

        </div>
      </section>

      {/* Benefícios */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-8 md:grid-cols-4">

          {BENEFICIOS.map((beneficio, i) => (
            <div key={i}>
              <beneficio.icon className="text-gold" size={28} />
              <h3 className="mt-4 font-display text-lg font-bold text-navy">
                {beneficio.titulo}
              </h3>
              <p className="mt-2 font-sans text-slate-500">
                {beneficio.texto}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* Formulário */}

      <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl">

          <h2 className="text-center font-display text-3xl font-bold text-navy">
            Conte sobre o seu imóvel
          </h2>

          <p className="mt-3 text-center font-sans text-slate-500">
            Leva menos de 2 minutos.
          </p>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <VenderImovelForm />
          </div>

        </div>
      </section>

    </div>
  );
}
