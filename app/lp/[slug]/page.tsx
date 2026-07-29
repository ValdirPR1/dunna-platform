export const revalidate = 0;

import Image from "next/image";
import { notFound } from "next/navigation";
import {
  buscarLandingPagePorSlug,
  registrarVisitaLandingPage,
} from "@/features/landingpages/services/landingpages.service";
import {
  getEmpreendimentoPorId,
  listarPlantasEmpreendimento,
} from "@/features/site/services/empreendimentos.service";
import GaleriaComModal from "@/features/site/components/GaleriaComModal";
import { iconeDaComodidade } from "@/features/empreendimentos/constants/iconesComodidades";
import FormularioLandingPage from "@/features/landingpages/components/FormularioLandingPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function extrairYoutubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;

  const pagina = await buscarLandingPagePorSlug(slug);
  if (!pagina || !pagina.empreendimento_id) {
    notFound();
  }

  const empreendimento = await getEmpreendimentoPorId(
    pagina.empreendimento_id
  );
  if (!empreendimento) {
    notFound();
  }

  registrarVisitaLandingPage(pagina.id);

  const plantas = await listarPlantasEmpreendimento(empreendimento.id);

  const youtubeId = pagina.video_url
    ? extrairYoutubeId(pagina.video_url)
    : null;

  const comodidades = empreendimento.comodidades ?? [];
  const temLazer = comodidades.length > 0;
  const temEstatisticas = (pagina.estatisticas ?? []).length > 0;
  const temDistancias = (pagina.distancias ?? []).length > 0;

  // Destaques: monta 3 cartões automaticamente a partir das primeiras
  // fotos + comodidades já cadastradas, sem precisar recadastrar nada
  const destaques = (empreendimento.fotos ?? [])
    .slice(0, 3)
    .map((foto, i) => ({
      foto,
      titulo: comodidades[i] ?? empreendimento.nome,
    }));

  const SECOES = [
    { id: "empreendimento", label: "O empreendimento" },
    ...(plantas.length > 0 ? [{ id: "plantas", label: "Plantas" }] : []),
    ...(temLazer ? [{ id: "estrutura", label: "Estrutura" }] : []),
    { id: "localizacao", label: "Localização" },
  ];

  return (
    <div className="bg-white">

      {/* Nav */}

      <nav className="sticky top-0 z-30 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <span className="font-display text-lg font-bold text-white">
            {empreendimento.nome}
          </span>

          <div className="hidden items-center gap-7 md:flex">
            {SECOES.map((secao) => (
              <a
                key={secao.id}
                href={`#${secao.id}`}
                className="font-sans text-sm font-medium text-white/70 transition hover:text-gold"
              >
                {secao.label}
              </a>
            ))}
          </div>

          <a
            href="#contato"
            className="rounded-xl bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-white transition hover:brightness-105"
          >
            Falar com corretor
          </a>

        </div>
      </nav>

      {/* Hero */}

      <section
        className="relative flex min-h-[620px] items-end bg-slate-900 bg-cover bg-center px-6 pb-16 pt-24"
        style={
          empreendimento.fotoCapa
            ? { backgroundImage: `url(${empreendimento.fotoCapa})` }
            : undefined
        }
      >

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="relative mx-auto w-full max-w-5xl">

          <span className="rounded-full bg-gold px-4 py-1.5 font-sans text-sm font-semibold text-white">
            Lançamento · {empreendimento.cidade}
          </span>

          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-white md:text-6xl">
            {pagina.headline || empreendimento.nome}
          </h1>

          {pagina.subheadline && (
            <p className="mt-5 max-w-2xl font-sans text-xl text-white/85">
              {pagina.subheadline}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contato"
              className="rounded-2xl bg-gold px-8 py-4 font-sans text-lg font-semibold text-white transition hover:brightness-105"
            >
              Quero receber a tabela
            </a>
            <a
              href="#empreendimento"
              className="rounded-2xl border border-white/30 px-8 py-4 font-sans text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Conhecer o projeto
            </a>
          </div>

          {pagina.badges && pagina.badges.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {pagina.badges.map((badge, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-sm text-white backdrop-blur"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

        </div>

      </section>

      {/* Vídeo, se tiver */}

      {(youtubeId || pagina.video_url) && (
        <section className="bg-navy px-6 py-16">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl shadow-2xl">
            {youtubeId ? (
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Vídeo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls className="aspect-video w-full" src={pagina.video_url!} />
            )}
          </div>
        </section>
      )}

      {/* O empreendimento */}

      <section id="empreendimento" className="mx-auto max-w-5xl px-6 py-20 text-center">

        <span className="font-sans font-semibold text-gold">
          O EMPREENDIMENTO
        </span>

        <h2 className="mt-3 font-display text-4xl font-bold text-navy">
          Conheça o {empreendimento.nome}
        </h2>

        <p className="mx-auto mt-6 max-w-3xl whitespace-pre-line font-sans text-lg leading-9 text-slate-600">
          {empreendimento.descricao ?? ""}
        </p>

        {temEstatisticas && (
          <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-3">
            {pagina.estatisticas!.map((item, i) => (
              <div key={i}>
                <p className="font-display text-4xl font-bold text-gold md:text-5xl">
                  {item.valor}
                </p>
                <p className="mt-2 font-sans text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Destaques */}

      {destaques.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">

            <h2 className="text-center font-display text-4xl font-bold text-navy">
              Cada detalhe pensado para você.
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">

              {destaques.map((item, i) => (
                <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="relative h-64 w-full">
                    <Image
                      src={item.foto}
                      alt={item.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-navy">
                      {item.titulo}
                    </h3>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </section>
      )}

      {/* Tipologias / Plantas */}

      {plantas.length > 0 && (
        <section id="plantas" className="mx-auto max-w-5xl px-6 py-20">

          <h2 className="text-center font-display text-4xl font-bold text-navy">
            Escolha a tipologia ideal para você.
          </h2>

          <div className="mt-14 space-y-10">

            {plantas.map((planta, i) => (
              <div
                key={planta.id}
                className="flex flex-col items-start gap-6 border-b border-slate-100 pb-10 md:flex-row"
              >

                <span className="font-display text-3xl font-bold text-slate-200">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative h-40 w-full overflow-hidden rounded-2xl md:w-56">
                  <Image
                    src={planta.imagem_url}
                    alt={planta.tipologia}
                    fill
                    sizes="(max-width: 768px) 100vw, 224px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-navy">
                    {planta.tipologia}
                  </h3>
                  {planta.area && (
                    <p className="mt-1 font-sans text-slate-500">
                      {planta.area}m²
                    </p>
                  )}
                  {planta.preco_a_partir && (
                    <p className="mt-2 font-sans font-semibold text-gold">
                      A partir de{" "}
                      {planta.preco_a_partir.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  )}
                </div>

                <a
                  href="#contato"
                  className="whitespace-nowrap font-sans font-semibold text-gold hover:underline"
                >
                  Ver planta →
                </a>

              </div>
            ))}

          </div>

        </section>
      )}

      {/* Galeria */}

      {empreendimento.fotos && empreendimento.fotos.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center font-display text-4xl font-bold text-navy">
              Fotos do Projeto
            </h2>
            <GaleriaComModal fotos={empreendimento.fotos} titulo={empreendimento.nome} />
          </div>
        </section>
      )}

      {/* Estrutura de resort / lazer */}

      {temLazer && (
        <section id="estrutura" className="mx-auto max-w-6xl px-6 py-20">

          <h2 className="text-center font-display text-4xl font-bold text-navy">
            Lazer completo, sem sair de casa.
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {comodidades.map((item) => {
              const Icone = iconeDaComodidade(item);
              return (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-5"
                >
                  <Icone size={20} className="shrink-0 text-gold" />
                  <span className="font-sans text-slate-700">{item}</span>
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* Localização */}

      <section
        id="localizacao"
        className="border-t border-slate-100 bg-navy px-6 py-20 text-white"
      >
        <div className="mx-auto max-w-5xl text-center">

          <h2 className="font-display text-4xl font-bold">
            {empreendimento.cidade}, um lugar único.
          </h2>

          {empreendimento.localizacao_texto && (
            <p className="mx-auto mt-6 max-w-3xl font-sans text-lg text-white/80">
              {empreendimento.localizacao_texto}
            </p>
          )}

          {temDistancias && (
            <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
              {pagina.distancias!.map((item, i) => (
                <div key={i}>
                  <p className="font-display text-3xl font-bold text-gold">
                    {item.valor}
                  </p>
                  <p className="mt-2 font-sans text-sm text-white/70">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Formulário */}

      <section id="contato" className="border-t border-slate-100 bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-lg">

          <h2 className="text-center font-display text-3xl font-bold text-navy">
            Receba a tabela completa e condições de lançamento.
          </h2>

          <p className="mt-3 text-center font-sans text-slate-500">
            Atendimento exclusivo. Retornamos rapidinho.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">
            <FormularioLandingPage
              empreendimentoNome={empreendimento.nome}
              origem={`landing-page-${slug}`}
              tipologias={plantas.map((p) => p.tipologia)}
            />
          </div>

        </div>
      </section>

      {/* Rodapé */}

      <footer className="bg-[#101828] py-10 text-center font-sans text-sm text-slate-400">
        <p>{empreendimento.nome} · Dunna Imob · CRECI 19602-J</p>
        <p className="mt-1">
          © {new Date().getFullYear()} — Todos os direitos reservados.{" "}
          {pagina.aviso_legal}
        </p>
      </footer>

    </div>
  );
}
