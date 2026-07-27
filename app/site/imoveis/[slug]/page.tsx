export const revalidate = 0;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getImovelBySlug,
  getImagensImovel,
  getCorretorImovel,
  getImoveisSemelhantes,
} from "@/features/site/services/imoveis.service";
import { SITE_URL } from "@/lib/siteUrl";
import GaleriaComModal from "@/features/site/components/GaleriaComModal";
import ShareButtons from "@/components/shared/ShareButtons";
import BotaoAgendarVisita from "@/features/site/components/BotaoAgendarVisita";
import BotaoWhatsappComLead from "@/features/site/components/BotaoWhatsappComLead";
import PropertyCard from "@/features/site/components/PropertyCard";
import { registrarVisualizacao } from "@/features/site/services/visualizacoes.service";
import { iconeDoDetalhe } from "@/features/imoveis/constants/iconesDetalhes";
import {
  BedDouble,
  Bath,
  Car,
  Maximize,
  CreditCard,
  MapPin,
  Sparkles,
} from "lucide-react";

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

const SECOES = [
  { id: "apresentacao", label: "Apresentação" },
  { id: "detalhes", label: "Detalhes e Diferenciais" },
  { id: "localizacao", label: "Localização" },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    return { title: "Imóvel não encontrado | Dunna Imob" };
  }

  const local = imovel.bairro || imovel.cidade || "";
  const titulo = `${imovel.titulo}${local ? ` em ${local}` : ""} | Dunna Imob`;
  const descricao =
    imovel.descricao?.slice(0, 155) ??
    `${imovel.titulo}. Confira fotos, valores e detalhes deste imóvel${local ? ` em ${local}` : ""}.`;

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical: `/site/imoveis/${imovel.slug}`,
    },
    openGraph: {
      title: titulo,
      description: descricao,
      url: `/site/imoveis/${imovel.slug}`,
      type: "website",
      images: imovel.foto_capa ? [{ url: imovel.foto_capa }] : undefined,
    },
  };
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
    { icon: BedDouble, valor: imovel.suites, label: "suítes" },
    { icon: Bath, valor: imovel.banheiros, label: "banheiros" },
    { icon: Car, valor: imovel.vagas, label: "vagas" },
    {
      icon: Maximize,
      valor: imovel.area_privativa ? `${imovel.area_privativa}m²` : null,
      label: "de área privativa",
    },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  const mensagemWhatsapp = `Tenho interesse no imóvel "${imovel.titulo}".`;

  const enderecoCompleto = [imovel.endereco, imovel.bairro, imovel.cidade]
    .filter(Boolean)
    .join(", ");

  const temDetalhes = (imovel.detalhes ?? []).length > 0;

  const imoveisSemelhantes = await getImoveisSemelhantes(imovel);

  const produtoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: imovel.titulo,
    description: imovel.descricao ?? undefined,
    image: imagens.length > 0 ? imagens : undefined,
    offers: {
      "@type": "Offer",
      price: imovel.preco,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/site/imoveis/${imovel.slug}`,
    },
  };

  return (
    <div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(produtoJsonLd) }}
      />

      {/* Capa */}

      <section
        className="relative h-[520px] bg-slate-200 bg-cover bg-center"
        style={
          imovel.foto_capa
            ? { backgroundImage: `url(${imovel.foto_capa})` }
            : undefined
        }
      >

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-14 left-1/2 w-full max-w-7xl -translate-x-1/2 px-6">

          {imovel.selo && (
            <span className="rounded-full bg-gold px-4 py-2 font-sans text-sm font-semibold text-white">
              {imovel.selo}
            </span>
          )}

          <h1 className="mt-6 max-w-4xl break-words font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {imovel.titulo}
          </h1>

          <p className="mt-3 font-sans text-xl text-white/90">
            {imovel.bairro || imovel.cidade}
          </p>

          {imovel.codigo && (
            <p className="mt-1 font-sans text-sm text-white/60">
              Código: {imovel.codigo}
            </p>
          )}

        </div>

      </section>

      {/* Navegação entre seções */}

      <nav className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-6 py-4">
          {SECOES.map((secao) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              className="whitespace-nowrap font-sans text-sm font-semibold text-slate-500 transition hover:text-gold"
            >
              {secao.label}
            </a>
          ))}
        </div>
      </nav>

      <div id="apresentacao" className="mx-auto max-w-7xl px-6 py-16">

        {imagens.length > 0 && (
          <GaleriaComModal fotos={imagens} />
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">

          <div>

            <p className="font-sans text-lg text-slate-500">
              {imovel.bairro || imovel.cidade}
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

              <h2 className="mt-2 break-words font-display text-3xl font-bold text-navy sm:text-4xl">
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

              <BotaoWhatsappComLead
                label="Falar via WhatsApp"
                mensagemWhatsapp={mensagemWhatsapp}
                origem={`imovel-${imovel.slug}`}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-4 font-sans text-lg font-semibold text-white transition hover:bg-gold-dark"
              />

              <BotaoAgendarVisita
                imovelTitulo={imovel.titulo}
                corretorId={imovel.corretor_id}
              />

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

              {corretor && (
                <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-5">

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

            </div>

          </aside>

        </div>

      </div>

      {/* Detalhes e Diferenciais */}

      {temDetalhes && (
        <section
          id="detalhes"
          className="border-t border-slate-100 bg-slate-50 px-6 py-16"
        >
          <div className="mx-auto max-w-7xl">

            <div className="flex items-center gap-3">
              <Sparkles className="text-gold" size={26} />
              <h2 className="font-display text-3xl font-bold text-navy">
                Detalhes e Diferenciais
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

              {(imovel.detalhes ?? []).map((item) => {
                const Icone = iconeDoDetalhe(item);

                return (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <Icone size={20} className="shrink-0 text-gold" />
                    <span className="font-sans text-slate-700">
                      {item}
                    </span>
                  </div>
                );
              })}

            </div>

          </div>
        </section>
      )}

      {/* Localização */}

      {enderecoCompleto && (
        <section
          id="localizacao"
          className="border-t border-slate-100 px-6 py-16"
        >
          <div className="mx-auto max-w-7xl">

            <div className="flex items-center gap-3">
              <MapPin className="text-gold" size={26} />
              <h2 className="font-display text-3xl font-bold text-navy">
                Localização
              </h2>
            </div>

            <p className="mt-4 font-sans text-lg text-slate-600">
              {enderecoCompleto}
            </p>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <iframe
                title="Mapa do imóvel"
                width="100%"
                height="360"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  enderecoCompleto
                )}&output=embed`}
              />
            </div>

          </div>
        </section>
      )}

      {/* Imóveis Semelhantes */}

      {imoveisSemelhantes.length > 0 && (
        <section className="border-t border-slate-100 px-6 py-16">
          <div className="mx-auto max-w-7xl">

            <h2 className="font-display text-3xl font-bold text-navy">
              Imóveis Semelhantes
            </h2>

            <p className="mt-2 font-sans text-slate-500">
              Outras opções com o mesmo perfil que podem te interessar.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              {imoveisSemelhantes.map((item) => (
                <PropertyCard
                  key={item.id}
                  slug={item.slug ?? ""}
                  titulo={item.titulo}
                  cidade={item.cidade ?? ""}
                  bairro={item.bairro}
                  preco={formatarPreco(item.preco ?? 0)}
                  imagem={item.foto_capa ?? undefined}
                  fotos={item.fotos}
                  tag={item.selo ?? undefined}
                  tipo={item.tipo}
                  quartos={item.quartos}
                  banheiros={item.banheiros}
                  vagas={item.vagas}
                  area={item.area_privativa}
                />
              ))}

            </div>

          </div>
        </section>
      )}

    </div>
  );
}
