export const revalidate = 21600;

import type { Metadata } from "next";
import { Star, ExternalLink, MessageSquarePlus } from "lucide-react";
import { obterAvaliacoesGoogle } from "@/features/avaliacoes/services/avaliacoes.service";

export const metadata: Metadata = {
  title: "Avaliações | Dunna Imob",
  description:
    "Veja o que os clientes da Dunna Imob dizem sobre a experiência de comprar, vender ou investir em imóveis de praia com a gente.",
  alternates: {
    canonical: "/site/avaliacoes",
  },
};

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < Math.round(nota)
              ? "fill-gold text-gold"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default async function AvaliacoesPage() {
  const dados = await obterAvaliacoesGoogle();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      <span className="font-sans font-semibold text-gold">
        AVALIAÇÕES DUNNA
      </span>

      <h1 className="mt-3 break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
        O que dizem sobre a gente
      </h1>

      <p className="mt-4 max-w-2xl font-sans text-lg text-slate-500">
        Avaliações reais de quem já comprou, vendeu ou investiu em
        imóveis de praia com a Dunna, direto do nosso perfil no
        Google.
      </p>

      {!dados.disponivel ? (

        <div className="mt-16 rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Nossas avaliações aparecerão aqui em breve.
          </p>
        </div>

      ) : (

        <>
          <div className="mt-12 flex flex-col items-start gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold text-navy">
                  {dados.notaMedia?.toFixed(1)}
                </span>
                <div>
                  <Estrelas nota={dados.notaMedia ?? 0} />
                  <p className="mt-1 font-sans text-sm text-slate-500">
                    com base em {dados.totalAvaliacoes} avaliações no
                    Google
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {dados.linkAvaliar && (
                <a
                  href={dados.linkAvaliar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
                >
                  <MessageSquarePlus size={18} />
                  Deixar uma avaliação
                </a>
              )}

              {dados.linkGoogle && (
                <a
                  href={dados.linkGoogle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-sans font-semibold text-navy transition hover:border-gold hover:text-gold"
                >
                  Ver no Google
                  <ExternalLink size={16} />
                </a>
              )}

            </div>

          </div>

          {dados.avaliacoes && dados.avaliacoes.length > 0 && (

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {dados.avaliacoes.map((avaliacao, i) => (

                <div
                  key={i}
                  className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                >

                  <div className="flex items-center gap-3">

                    {avaliacao.fotoAutor ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avaliacao.fotoAutor}
                        alt={avaliacao.autor}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-sans font-semibold text-slate-400">
                        {avaliacao.autor.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-sans font-semibold text-navy">
                        {avaliacao.autor}
                      </p>
                      <p className="font-sans text-xs text-slate-400">
                        {avaliacao.tempoRelativo}
                      </p>
                    </div>

                  </div>

                  <div className="mt-3">
                    <Estrelas nota={avaliacao.nota} />
                  </div>

                  <p className="mt-3 font-sans text-sm text-slate-600">
                    {avaliacao.texto}
                  </p>

                </div>

              ))}

            </div>

          )}
        </>

      )}

    </div>
  );
}
