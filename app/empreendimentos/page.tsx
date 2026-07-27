import AppShell from "@/components/app/AppShell";
import EmpreendimentoCard from "@/features/empreendimentos/components/EmpreendimentoCard";
import BotaoNovoEmpreendimento from "@/features/empreendimentos/components/BotaoNovoEmpreendimento";
import { listarEmpreendimentos } from "@/features/empreendimentos/services/empreendimentos.service";
import { listarCapasPorEmpreendimentos } from "@/features/empreendimentos/services/imagens.service";

export default async function EmpreendimentosPage() {
  const { data: empreendimentos } = await listarEmpreendimentos();

  const capas = await listarCapasPorEmpreendimentos(
    (empreendimentos ?? []).map((emp: any) => emp.id)
  );

  return (
    <AppShell>
      <div>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="font-display text-2xl font-bold text-navy md:text-3xl">
              Empreendimentos
            </h1>

            <p className="mt-2 font-sans text-slate-500">
              Gerencie todos os empreendimentos cadastrados.
            </p>

          </div>

          <BotaoNovoEmpreendimento />

        </div>

        {(!empreendimentos || empreendimentos.length === 0) && (
          <p className="font-sans text-slate-500">
            Nenhum empreendimento cadastrado ainda.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {(empreendimentos ?? []).map((emp: any) => (
            <EmpreendimentoCard
              key={emp.id}
              id={emp.id}
              nome={emp.nome}
              cidade={emp.cidade}
              status={emp.status ?? "—"}
              imagem={capas[emp.id]}
            />
          ))}

        </div>

      </div>
    </AppShell>
  );
}
