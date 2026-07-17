import { getFeaturedProperties } from "@/features/site/services/imoveis.service";
import PropertyCard from "@/features/site/components/PropertyCard";

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default async function FeaturedProperties() {
  const imoveis = await getFeaturedProperties();

  if (imoveis.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">

      <div className="mb-14">

        <span className="font-sans font-semibold text-gold">
          IMÓVEIS EM DESTAQUE
        </span>

        <h2 className="mt-3 font-display text-5xl font-semibold text-navy">
          Selecionados para você
        </h2>

        <p className="mt-4 max-w-3xl font-sans text-lg text-slate-500">
          Uma curadoria dos imóveis mais procurados no litoral
          pernambucano, prontos para morar ou investir.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-3">

        {imoveis.slice(0, 3).map((imovel) => (

          <PropertyCard
            key={imovel.id}
            slug={imovel.slug}
            titulo={imovel.titulo}
            cidade={imovel.cidade}
            preco={formatarPreco(imovel.preco)}
            imagem={imovel.foto_capa ?? undefined}
            fotos={imovel.fotos}
            tag={imovel.selo ?? undefined}
            quartos={imovel.quartos}
            banheiros={imovel.banheiros}
            vagas={imovel.vagas}
            area={imovel.area_privativa}
          />

        ))}

      </div>

    </section>
  );
}
