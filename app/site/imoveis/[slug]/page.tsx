import { notFound } from "next/navigation";
import {
  getImovelBySlug,
  getImagensImovel,
  getCorretorImovel,
} from "@/features/site/services/imoveis.service";
import ImageGallery from "@/features/site/components/ImageGallery";
import ShareButtons from "@/components/shared/ShareButtons";
import { registrarVisualizacao } from "@/features/site/services/visualizacoes.service";
import { BedDouble, Bath, Car, Maximize, CreditCard } from "lucide-react";

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

  registrarVisualizacao(imovel.id);

  const imagensExtras = await getImagensImovel(imovel.id);

  const imagens = [
    imovel.foto_capa,
    ...imagensExtras.map((img) => img.url),
  ].filter((url): url is string => Boolean(url));

  const corretor = imovel.corretor_id
    ? await getCorretorImovel(imovel.corretor_id)
    : null;

  const specs = [
    { icon: BedDouble, valor: imovel.quartos, label: "dormitórios" },
    { icon: Bath, valor: imovel.banheiros, label: "banheiros" },
    { icon: Car, valor: imovel.vagas, label: "vagas" },
    {
      icon: Maximize,
      valor: imovel.area_privativa ? `${imovel.area_privativa}m²` : null,
      label: "de área privativa",
    },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  const mensagemWhatsapp = encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${imovel.titulo}".`
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      {imagens.length > 0 ? (
        <ImageGallery images={imagens} />
      ) : (
        <div className="h-[400px] w-full rounded-3xl bg-slate-200" />
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">

        <div>

          {imovel.selo && (
            <span className="rounded-full bg-gold px-4 py-2 font-sans text-sm font-semibold text-white">
              {imovel.selo}
            </span>
          )}

          <h1 className="mt-5 font-display text-4xl font-bold text-navy">
            {imovel.titulo}
          </h1>

          <p className="mt-3 font-sans text-lg text-slate-500">
            {imovel.bairro ? `${imovel.bairro}, ` : ""}
            {imovel.cidade}
            {imovel.endereco ? ` • ${imovel.endereco}` : ""}
          </p>

          {specs.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-8 border-y border-slate-200 py-6 font-sans text-slate-600">

              {specs.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <item.icon size={20} className="text-gold" />
                  <strong className="text-navy">{item.valor}</strong>
                  {item.label}
                </span>
              ))}

            </div>
          )}

          <h2 className="mt-10 font-display text-2xl font-bold text-navy">
            Sobre o imóvel
          </h2>

          <p className="mt-5 whitespace-pre-line font-sans text-lg leading-9 text-slate-600">
            {imovel.descricao ?? "Descrição em breve."}
          </p>

        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-28">

          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm">

            <p className="font-sans text-slate-500">Valor</p>

            <h2 className="mt-2 font-display text-4xl font-bold text-navy">
              {formatarPreco(imovel.preco)}
            </h2>

            {(imovel.condominio || imovel.iptu) && (
              <div className="mt-4 space-y-1 font-sans text-sm text-slate-500">
                {imovel.condominio && (
                  <p className="flex items-center gap-2">
                    <CreditCard size={14} />
                    Condomínio: {formatarPreco(imovel.condominio)}
                  </p>
                )}
                {imovel.iptu && (
                  <p className="flex items-center gap-2">
                    <CreditCard size={14} />
                    IPTU: {formatarPreco(imovel.iptu)}
                  </p>
                )}
              </div>
            )}

            <a
              href={`https://wa.me/5581999999999?text=${mensagemWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 font-sans text-lg font-semibold text-white transition hover:bg-gold-dark"
            >
              Falar via WhatsApp
            </a>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="mb-3 font-sans text-sm text-slate-500">
                Compartilhar este imóvel
              </p>
              <ShareButtons
                titulo={imovel.titulo}
                path={`/site/imoveis/${imovel.slug}`}
                variante="site"
              />
            </div>

          </div>

          {corretor && (
            <div className="flex items-center gap-4 rounded-3xl border border-slate-200 p-6 shadow-sm">

              <div
                className="h-14 w-14 shrink-0 rounded-full bg-slate-200 bg-cover bg-center"
                style={
                  corretor.foto
                    ? { backgroundImage: `url(${corretor.foto})` }
                    : undefined
                }
              />

              <div>
                <p className="font-sans font-semibold text-navy">
                  {corretor.nome}
                </p>

                {corretor.creci && (
                  <p className="font-sans text-sm text-slate-500">
                    CRECI {corretor.creci}
                  </p>
                )}

                {corretor.telefone && (
                  <p className="font-sans text-sm text-slate-500">
                    {corretor.telefone}
                  </p>
                )}
              </div>

            </div>
          )}

        </aside>

      </div>

    </div>
  );
}
