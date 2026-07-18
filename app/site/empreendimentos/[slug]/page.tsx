import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEmpreendimentoBySlug,
  listarPlantasEmpreendimento,
} from "@/features/site/services/empreendimentos.service";
import ShareButtons from "@/components/shared/ShareButtons";
import GaleriaComModal from "@/features/site/components/GaleriaComModal";
import { iconeDaComodidade } from "@/features/empreendimentos/constants/iconesComodidades";
import { MapPin, TrendingUp } from "lucide-react";

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
  { id: "localizacao", label: "Localização" },
  { id: "lazer", label: "Lazer e Conveniência" },
  { id: "plantas", label: "Tipologias e Plantas" },
  { id: "valorizacao", label: "Valorização" },
];

export default async function EmpreendimentoPage({ params }: PageProps) {
  const { slug } = await params;
  const empreendimento = await getEmpreendimentoBySlug(slug);

  if (!empreendimento) {
    notFound();
  }

  const plantas = await listarPlantasEmpreendimento(empreendimento.id);

  const enderecoCompleto = [
    empreendimento.endereco,
    empreendimento.bairro,
    empreendimento.cidade,
  ]
    .filter(Boolean)
    .join(", ");

  const temLazer = (empreendimento.comodidades ?? []).length > 0;
  const temPlantas = plantas.length > 0;
  const temValorizacao = Boolean(empreendimento.valorizacao_texto);

  return (
    <div className="bg-white">

      {/* Hero */}

      <section
        className="relative h-[520px] bg-slate-200 bg-cover bg-center"
        style={
          empreendimento.fotoCapa
            ? { backgroundImage: `url(${empreendimento.fotoCapa})` }
            : undefined
        }
      >

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-14 left-1/2 w-full max-w-7xl -translate-x-1/2 px-6">

          {empreendimento.status && (
            <span className="rounded-full bg-[#C8A96A] px-4 py-2 text-sm font-semibold text-white">
              {empreendimento.status.toUpperCase()}
            </span>
          )}

          <h1 className="mt-6 text-6xl font-bold text-white">
            {empreendimento.nome}
          </h1>

          <p className="mt-3 text-xl text-white/90">
            {empreendimento.bairro} • {empreendimento.cidade}
          </p>

        </div>

      </section>

      {/* Navegação entre seções */}

      <nav className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-6 py-4">
          {SECOES.map((secao) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              className="whitespace-nowrap font-sans text-sm font-semibold text-slate-500 transition hover:text-[#C8A96A]"
            >
              {secao.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Conteúdo */}

      <section id="apresentacao" className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">

          <div>

            <h2 className="text-4xl font-bold">
              Sobre o empreendimento
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              {empreendimento.descricao ??
                "Descrição em breve."}
            </p>

            {empreendimento.fotos && empreendimento.fotos.length > 0 && (
              <div className="mt-10">
                <GaleriaComModal fotos={empreendimento.fotos} />
              </div>
            )}

          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 p-8 shadow-sm lg:sticky lg:top-28">

            <button className="mt-2 w-full rounded-2xl bg-[#C8A96A] py-4 text-lg font-semibold text-white">
              Falar com especialista
            </button>

            <Link
              href="/site/imoveis"
              className="mt-4 block text-center font-semibold text-[#C8A96A]"
            >
              Ver unidades disponíveis
            </Link>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <p className="mb-3 font-sans text-sm text-slate-500">
                Compartilhar este empreendimento
              </p>
              <ShareButtons
                titulo={empreendimento.nome}
                path={`/site/empreendimentos/${empreendimento.slug}`}
                variante="site"
              />
            </div>

          </aside>

        </div>

      </section>

      {/* Localização */}

      <section
        id="localizacao"
        className="border-t border-slate-100 bg-slate-50 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex items-center gap-3">
            <MapPin className="text-[#C8A96A]" size={28} />
            <h2 className="text-4xl font-bold">Localização</h2>
          </div>

          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
            {empreendimento.localizacao_texto ??
              `Localizado em ${empreendimento.bairro ?? ""}, ${empreendimento.cidade}.`}
          </p>

          {enderecoCompleto && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
              <iframe
                title="Mapa do empreendimento"
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  enderecoCompleto
                )}&output=embed`}
              />
            </div>
          )}

        </div>
      </section>

      {/* Lazer e Conveniência */}

      {temLazer && (
        <section
          id="lazer"
          className="border-t border-slate-100 px-6 py-20"
        >
          <div className="mx-auto max-w-7xl">

            <h2 className="text-4xl font-bold">
              Lazer e Conveniência
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

              {(empreendimento.comodidades ?? []).map((item) => {
                const Icone = iconeDaComodidade(item);

                return (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 p-5"
                  >
                    <Icone size={22} className="shrink-0 text-[#C8A96A]" />
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

      {/* Tipologias e Plantas */}

      {temPlantas && (
        <section
          id="plantas"
          className="border-t border-slate-100 bg-slate-50 px-6 py-20"
        >
          <div className="mx-auto max-w-7xl">

            <h2 className="text-4xl font-bold">
              Tipologias e Plantas
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {plantas.map((planta) => (
                <div
                  key={planta.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >

                  <img
                    src={planta.imagem_url}
                    alt={planta.tipologia}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">

                    <h3 className="text-xl font-bold">
                      {planta.tipologia}
                    </h3>

                    <p className="mt-2 font-sans text-slate-500">
                      {planta.area ? `${planta.area}m²` : ""}
                    </p>

                    {planta.preco_a_partir && (
                      <p className="mt-3 font-sans text-lg font-bold text-[#C8A96A]">
                        A partir de {formatarPreco(planta.preco_a_partir)}
                      </p>
                    )}

                  </div>

                </div>
              ))}

            </div>

          </div>
        </section>
      )}

      {/* Valorização */}

      {temValorizacao && (
        <section
          id="valorizacao"
          className="border-t border-slate-100 px-6 py-20"
        >
          <div className="mx-auto max-w-4xl">

            <div className="flex items-center gap-3">
              <TrendingUp className="text-[#C8A96A]" size={28} />
              <h2 className="text-4xl font-bold">
                Potencial de Valorização
              </h2>
            </div>

            <p className="mt-6 whitespace-pre-line text-lg leading-9 text-slate-600">
              {empreendimento.valorizacao_texto}
            </p>

          </div>
        </section>
      )}

    </div>
  );
}
