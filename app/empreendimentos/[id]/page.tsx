import { notFound } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { buscarEmpreendimento } from "@/features/empreendimentos/services/empreendimentos.service";
import { listarImagens } from "@/features/empreendimentos/services/imagens.service";
import Units from "@/features/empreendimentos/components/details/Units";
import AcoesCompletasEmpreendimento from "@/features/empreendimentos/components/details/AcoesCompletasEmpreendimento";
import GaleriaFotos from "@/features/empreendimentos/components/details/GaleriaFotos";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmpreendimentoDetalhesPage({
  params,
}: PageProps) {
  const { id } = await params;
  const { data: empreendimento, error } = await buscarEmpreendimento(id);

  if (error || !empreendimento) {
    notFound();
  }

  const fotos = await listarImagens(id);

  return (
    <AppShell>
      <div className="space-y-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <span className="font-sans font-semibold text-gold">
              {empreendimento.status ?? ""}
            </span>

            <h1 className="mt-2 font-display text-2xl font-bold text-navy md:text-4xl">
              {empreendimento.nome}
            </h1>

            <p className="mt-2 font-sans text-slate-500">
              {empreendimento.bairro ? `${empreendimento.bairro}, ` : ""}
              {empreendimento.cidade}
            </p>

          </div>

          <AcoesCompletasEmpreendimento
            id={empreendimento.id}
            nome={empreendimento.nome}
            slug={empreendimento.slug}
            fotos={fotos.map((f: any) => f.url)}
          />

        </div>

        {!empreendimento.publicado && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 font-sans text-sm text-amber-700">
            ⚠️ Este empreendimento ainda não está publicado no site — o
            link só vai funcionar depois que você marcar "Publicado" na
            edição.
          </div>
        )}

        <GaleriaFotos fotos={fotos} />

        <Units
          empreendimento={{
            id: empreendimento.id,
            nome: empreendimento.nome,
            cidade: empreendimento.cidade,
            bairro: empreendimento.bairro,
            latitude: empreendimento.latitude,
            longitude: empreendimento.longitude,
          }}
        />

      </div>
    </AppShell>
  );
}
