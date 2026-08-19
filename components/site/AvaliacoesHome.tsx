import { obterAvaliacoesGoogle } from "@/features/avaliacoes/services/avaliacoes.service";
import AvaliacaoCard from "@/features/avaliacoes/components/AvaliacaoCard";
import AvaliacoesIntro from "./AvaliacoesIntro";
import AvaliacoesLinkMobile from "./AvaliacoesLinkMobile";

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

        <AvaliacoesIntro
          notaMedia={dados.notaMedia ?? null}
          totalAvaliacoes={dados.totalAvaliacoes ?? null}
        />

        <div className="grid gap-8 md:grid-cols-3">

          {avaliacoesParaMostrar.map((avaliacao, i) => (
            <AvaliacaoCard key={i} avaliacao={avaliacao} clamp />
          ))}

        </div>

        <AvaliacoesLinkMobile />

      </div>

    </section>
  );
}
