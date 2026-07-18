export const revalidate = 0;

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
import PlantasGaleria from "@/features/site/components/PlantasGaleria";
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

  const temLazer = (empreendimento.comodidades ?? []).length > 0;

  return (
    <div className="bg-white">

      {/* Hero */}

      <section
        className="relative flex min-h-[560px] items-center bg-slate-900 bg-cover bg-center px-6 py-20"
        style={
          !youtubeId && !pagina.video_url && empreendimento.fotoCapa
            ? { backgroundImage: `url(${empreendimento.fotoCapa})` }
            : undefined
        }
      >

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">

          <div className="text-white">

            <span className="rounded-full bg-[#C8A96A] px-4 py-1.5 font-sans text-sm font-semibold">
              {empreendimento.cidade}
            </span>

            <h1 className="mt-6 font-display text-5xl font-bold leading-tight">
              {pagina.headline || empreendimento.nome}
            </h1>

            {pagina.subheadline && (
              <p className="mt-5 font-sans text-xl text-white/85">
                {pagina.subheadline}
              </p>
            )}

            <a
              href="#form"
              className="mt-8 inline-block rounded-2xl bg-[#C8A96A] px-8 py-4 font-sans text-lg font-semibold text-white transition hover:brightness-105"
            >
              Quero saber mais
            </a>

          </div>

          {youtubeId ? (
            <div className="aspect-video overflow-hidden rounded-3xl shadow-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Vídeo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : pagina.video_url ? (
            <video
              controls
              className="aspect-video w-full rounded-3xl shadow-2xl"
              src={pagina.video_url}
            />
          ) : null}

        </div>

      </section>

      {/* Sobre */}

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">

        <h2 className="font-display text-3xl font-bold text-navy">
          Sobre o {empreendimento.nome}
        </h2>

        <p className="mt-5 whitespace-pre-line font-sans text-lg leading-9 text-slate-600">
          {empreendimento.descricao ?? ""}
        </p>

      </section>

      {/* Galeria */}

      {empreendimento.fotos && empreendimento.fotos.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center font-display text-3xl font-bold text-navy">
              Fotos do Projeto
            </h2>
            <GaleriaComModal fotos={empreendimento.fotos} />
          </div>
        </section>
      )}

      {/* Lazer e Conveniência */}

      {temLazer && (
        <section className="border-t border-slate-100 px-6 py-16">
          <div className="mx-auto max-w-6xl">

            <h2 className="mb-8 text-center font-display text-3xl font-bold text-navy">
              Lazer e Conveniência
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {(empreendimento.comodidades ?? []).map((item) => {
                const Icone = iconeDaComodidade(item);
                return (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 p-5"
                  >
                    <Icone size={20} className="shrink-0 text-[#C8A96A]" />
                    <span className="font-sans text-slate-700">{item}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* Tipologias e Plantas */}

      {plantas.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-display text-3xl font-bold text-navy">
              Tipologias e Plantas
            </h2>
            <PlantasGaleria plantas={plantas} />
          </div>
        </section>
      )}

      {/* Formulário */}

      <section
        id="form"
        className="border-t border-slate-100 bg-navy px-6 py-20"
      >
        <div className="mx-auto max-w-lg">

          <h2 className="text-center font-display text-3xl font-bold text-white">
            Quero saber mais
          </h2>

          <p className="mt-3 text-center font-sans text-white/70">
            Preenche seus dados que um corretor especialista te chama
            no WhatsApp.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-2xl">
            <FormularioLandingPage
              empreendimentoNome={empreendimento.nome}
              origem={`landing-page-${slug}`}
            />
          </div>

        </div>
      </section>

      {/* Rodapé mínimo */}

      <footer className="bg-[#101828] py-8 text-center font-sans text-sm text-slate-400">
        Dunna Imob • CRECI 19602-J
      </footer>

    </div>
  );
}
