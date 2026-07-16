import PropertyCard from "@/features/site/components/PropertyCard";
import { getImoveis } from "@/features/site/services/imoveis.service";

export const revalidate = 60;

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

interface PageProps {
  searchParams: Promise<{ regiao?: string }>;
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const { regiao } = await searchParams;

  const imoveis = await getImoveis();

  const imoveisFiltrados = regiao
    ? imoveis.filter(
        (item) => normalizar(item.cidade) === regiao
      )
    : imoveis;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-5xl font-bold">
        Imóveis
      </h1>

      <p className="mt-4 text-lg text-slate-500">
        Encontre o imóvel ideal para morar, investir ou rentabilizar.
      </p>

      {imoveisFiltrados.length === 0 && (
        <p className="mt-12 text-slate-500">
          {regiao
            ? "Nenhum imóvel encontrado para essa região no momento."
            : "Nenhum imóvel publicado no momento."}
        </p>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-3">

        {imoveisFiltrados.map((item) => (

          <PropertyCard
            key={item.id}
            slug={item.slug}
            titulo={item.titulo}
            cidade={item.cidade}
            preco={formatarPreco(item.preco)}
            imagem={item.foto_capa ?? undefined}
            tag={item.selo ?? undefined}
            quartos={item.quartos}
            banheiros={item.banheiros}
            vagas={item.vagas}
            area={item.area_privativa}
          />

        ))}

      </div>

    </div>
  );
}
