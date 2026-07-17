import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmpreendimentoBySlug } from "@/features/site/services/empreendimentos.service";
import ShareButtons from "@/components/shared/ShareButtons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EmpreendimentoPage({ params }: PageProps) {
  const { slug } = await params;
  const empreendimento = await getEmpreendimentoBySlug(slug);

  if (!empreendimento) {
    notFound();
  }

  return (
    <div className="bg-white">

      {/* Hero */}

      <section
        className="relative h-[520px] bg-slate-200 bg-cover bg-center"
        style={
          empreendimento.foto_capa
            ? { backgroundImage: `url(${empreendimento.foto_capa})` }
            : undefined
        }
      >

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-14 left-1/2 w-full max-w-7xl -translate-x-1/2 px-6">

          <span className="rounded-full bg-[#C8A96A] px-4 py-2 text-sm font-semibold text-white">
            {empreendimento.status.toUpperCase()}
          </span>

          <h1 className="mt-6 text-6xl font-bold text-white">
            {empreendimento.nome}
          </h1>

          <p className="mt-3 text-xl text-white/90">
            {empreendimento.bairro} • {empreendimento.cidade}
          </p>

        </div>

      </section>

      {/* Conteúdo */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">

          <div>

            <h2 className="text-4xl font-bold">
              Sobre o empreendimento
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              {empreendimento.descricao ??
                "Descrição em breve."}
            </p>

          </div>

          <aside className="rounded-3xl border border-slate-200 p-8 shadow-sm">

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

    </div>
  );
}
