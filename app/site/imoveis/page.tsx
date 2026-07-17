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
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

interface PageProps {
  searchParams: Promise<{
    regiao?: string;
    tipo?: string;
    quartos?: string;
    valor?: string;
  }>;
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const { regiao, tipo, quartos, valor } = await searchParams;

  const imoveis = await getImoveis();

  let imoveisFiltrados = imoveis;

  if (regiao) {
    const termoBusca = regiao.replace(/-/g, " ");

    imoveisFiltrados = imoveisFiltrados.filter((item) => {
      const textoCompleto = normalizar(
        `${item.cidade ?? ""} ${item.bairro ?? ""}`
      );
      return textoCompleto.includes(termoBusca);
    });
  }

  if (tipo) {
    imoveisFiltrados = imoveisFiltrados.filter(
      (item) => item.tipo?.toLowerCase() === tipo.toLowerCase()
    );
  }

  if (quartos) {
    const minimo = Number(quartos);
    imoveisFiltrados = imoveisFiltrados.filter((item) =>
      minimo >= 4 ? (item.quartos ?? 0) >= 4 : item.quartos === minimo
    );
  }

  if (valor) {
    const [minStr, maxStr] = valor.split("-");
    const min = Number(minStr) || 0;
    const max = maxStr ? Number(maxStr) : Infinity;

    imoveisFiltrados = imoveisFiltrados.filter(
      (item) => item.preco >= min && item.preco <= max
    );
  }

  const temFiltro = Boolean(regiao || tipo || quartos || valor);

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
          {temFiltro
            ? "Nenhum imóvel encontrado com esses filtros no momento."
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
