import { notFound } from "next/navigation";
import {
  getImovelBySlug,
  getImagensImovel,
} from "@/features/site/services/imoveis.service";
import ImageGallery from "@/features/site/components/ImageGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default async function ImovelPage({ params }: PageProps) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    notFound();
  }

  const imagensExtras = await getImagensImovel(imovel.id);

  const imagens = [
    imovel.foto_capa,
    ...imagensExtras.map((img) => img.url),
  ].filter((url): url is string => Boolean(url));

  const caracteristicas = [
    { label: "Quartos", valor: imovel.quartos },
    { label: "Suítes", valor: imovel.suites },
    { label: "Banheiros", valor: imovel.banheiros },
    { label: "Vagas", valor: imovel.vagas },
    {
      label: "Área privativa",
      valor: imovel.area_privativa
        ? `${imovel.area_privativa}m²`
        : null,
    },
    {
      label: "Área total",
      valor: imovel.area_total
        ? `${imovel.area_total}m²`
        : null,
    },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      {/* Título e localização */}

      <span className="rounded-full bg-[#C8A96A] px-4 py-2 text-sm font-semibold text-white">
        {imovel.tipo ?? "Imóvel"}
      </span>

      <h1 className="mt-6 text-5xl font-bold">
        {imovel.titulo}
      </h1>

      <p className="mt-3 text-lg text-slate-500">
        {imovel.bairro ? `${imovel.bairro}, ` : ""}
        {imovel.cidade}
        {imovel.endereco ? ` • ${imovel.endereco}` : ""}
      </p>

      {/* Galeria */}

      {imagens.length > 0 ? (
        <div className="mt-10">
          <ImageGallery images={imagens} />
        </div>
      ) : (
        <div className="mt-10 h-[400px] w-full rounded-3xl bg-slate-200" />
      )}

      <div className="mt-16 grid gap-16 lg:grid-cols-[2fr_1fr]">

        <div>

          <h2 className="text-3xl font-bold">
            Sobre o imóvel
          </h2>

          <p className="mt-6 text-lg leading-9 text-slate-600">
            {imovel.descricao ?? "Descrição em breve."}
          </p>

          {caracteristicas.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3">
              {caracteristicas.map((item) => (
                <div key={item.label}>
                  <h3 className="text-2xl font-bold">
                    {item.valor}
                  </h3>
                  <p className="text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 p-8 shadow-sm">

          <p className="text-slate-500">
            Valor
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {formatarPreco(imovel.preco)}
          </h2>

          {(imovel.condominio || imovel.iptu) && (
            <p className="mt-3 text-sm text-slate-500">
              {imovel.condominio
                ? `Condomínio ${formatarPreco(imovel.condominio)}`
                : ""}
              {imovel.condominio && imovel.iptu ? " • " : ""}
              {imovel.iptu
                ? `IPTU ${formatarPreco(imovel.iptu)}`
                : ""}
            </p>
          )}

          <button className="mt-10 w-full rounded-2xl bg-[#C8A96A] py-4 text-lg font-semibold text-white">
            Falar com especialista
          </button>

        </aside>

      </div>

    </div>
  );
}
