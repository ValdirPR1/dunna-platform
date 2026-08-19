import { getFeaturedEmpreendimentos } from "@/features/site/services/empreendimentos.service";
import DevelopmentCarousel from "@/features/site/components/DevelopmentCarousel";
import FeaturedDevelopmentsIntro from "./FeaturedDevelopmentsIntro";

export default async function FeaturedDevelopments() {
  const empreendimentos = await getFeaturedEmpreendimentos();

  if (empreendimentos.length === 0) {
    return null;
  }

  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <FeaturedDevelopmentsIntro />

      </div>

      <DevelopmentCarousel empreendimentos={empreendimentos} />

    </section>
  );
}
