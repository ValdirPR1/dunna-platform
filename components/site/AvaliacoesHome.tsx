import Link from "next/link";
import { Star } from "lucide-react";
import { obterAvaliacoesGoogle } from "@/features/avaliacoes/services/avaliacoes.service";

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
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

// Seção de avaliações reais do Google pra home do site. Só aparece
// quando a integração está configurada e devolveu pelo menos uma
// avaliação — enquanto isso (ex.: billing do Google Cloud ainda não
// ativado), a seção simplesmente não é renderizada, sem quebrar a
// página nem mostrar mensagem de erro pro visitante.
export default async function AvaliacoesHome() {
  const dados = await obterAvaliacoesGoogle();

  if (!dados.disponivel || !dados.avaliacoes || dados.avaliacoes.length === 0) {
    return null;
  }

  const avaliacoesParaMostrar = dados.avaliacoes.slice(0, 3);

  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="font-sans font-semibold text-gold">
              AVALIAÇÕES DUNNA
            </span>

            <h2 className="mt-3 max-w-xl break-words font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              O que dizem sobre a gente
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-display text-2xl font-bold text-navy">
                {dados.notaMedia?.toFixed(1)}
              </span>
              <Estrelas nota={dados.notaMedia ?? 0} />
              <span className="font-sans text-sm text-slate-500">
                ({dados.totalAvaliacoes} avaliações no Google)
              </span>
            </div>
          </div>

          <Link
            href="/site/avaliacoes"
            className="hidden font-sans font-semibold text-gold hover:underline md:block"
          >
            Ver todas as avaliações →
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {avaliacoesParaMostrar.map((avaliacao, i) => (

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

              <p className="mt-3 line-clamp-4 font-sans text-sm text-slate-600">
                {avaliacao.texto}
              </p>

            </div>

          ))}

        </div>

        <Link
          href="/site/avaliacoes"
          className="mt-8 block text-center font-sans font-semibold text-gold hover:underline md:hidden"
        >
          Ver todas as avaliações →
        </Link>

      </div>

    </section>
  );
}
