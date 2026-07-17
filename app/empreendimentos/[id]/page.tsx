import { notFound } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import { buscarEmpreendimento } from "@/features/empreendimentos/services/empreendimentos.service";
import Units from "@/features/empreendimentos/components/details/Units";
import EmpreendimentoActions from "@/features/empreendimentos/components/details/EmpreendimentoActions";
import ShareButtons from "@/components/shared/ShareButtons";

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

  return (
    <AppShell>
      <div className="space-y-8">

        <div className="flex items-start justify-between">

          <div>

            <span className="font-sans font-semibold text-gold">
              {empreendimento.status ?? ""}
            </span>

            <h1 className="mt-2 font-display text-4xl font-bold text-navy">
              {empreendimento.nome}
            </h1>

            <p className="mt-2 font-sans text-slate-500">
              {empreendimento.bairro ? `${empreendimento.bairro}, ` : ""}
              {empreendimento.cidade}
            </p>

          </div>

          <div className="flex items-center gap-3">

            {empreendimento.slug && (
              <ShareButtons
                titulo={empreendimento.nome}
                path={`/site/empreendimentos/${empreendimento.slug}`}
              />
            )}

            <EmpreendimentoActions
              id={empreendimento.id}
              nome={empreendimento.nome}
            />

          </div>

        </div>

        {!empreendimento.publicado && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 font-sans text-sm text-amber-700">
            ⚠️ Este empreendimento ainda não está publicado no site — o
            link só vai funcionar depois que você marcar "Publicado" na
            edição.
          </div>
        )}

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
