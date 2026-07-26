import { getFeaturedEmpreendimentos } from "@/features/site/services/empreendimentos.service";
import DevelopmentCarousel from "@/features/site/components/DevelopmentCarousel";

export default async function FeaturedDevelopments() {
  const empreendimentos = await getFeaturedEmpreendimentos();

  if (empreendimentos.length === 0) {
    return null;
  }

  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12">

          <span className="font-sans font-semibold text-gold">
            EMPREENDIMENTOS
          </span>

          <h2 className="mt-3 max-w-3xl break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
            Lançamentos e empreendimentos
          </h2>

        </div>

      </div>

      <DevelopmentCarousel empreendimentos={empreendimentos} />

    </section>
  );
}
