import Hero from "@/components/site/Hero";
import SearchBar from "@/components/site/SearchBar";
import Regions from "@/components/site/Regions";
import FeaturedDevelopments from "@/components/site/FeaturedDevelopments";
import About from "@/components/site/About";
import CTA from "@/components/site/CTA";
import PropertyCarousel from "@/features/site/components/PropertyCarousel";
import { getFeaturedProperties } from "@/features/site/services/imoveis.service";

export default async function HomePage() {
  const destaques = await getFeaturedProperties();

  return (
    <>
      <Hero />

      <SearchBar />

      <div className="py-16">

        <div className="mx-auto mb-10 max-w-7xl px-6">

          <span className="font-sans font-semibold text-gold">
            IMÓVEIS EM DESTAQUE
          </span>

          <h2 className="mt-3 font-display text-4xl font-bold text-navy">
            Oportunidades selecionadas
          </h2>

          <p className="mt-3 max-w-2xl font-sans text-lg text-slate-500">
            Imóveis escolhidos pela equipe Dunna para morar, investir
            e rentabilizar.
          </p>

        </div>

        <PropertyCarousel imoveis={destaques} />

      </div>

      <FeaturedDevelopments />

      <Regions />

      <About />

      <CTA />
    </>
  );
}
