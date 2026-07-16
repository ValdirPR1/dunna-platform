import { listarEmpreendimentos } from "@/features/empreendimentos/services/empreendimento.service";
import EmpreendimentosGrid from "@/features/empreendimentos/components/EmpreendimentosGrid";
import Link from "next/link";
import WorkspaceLayout from "@/features/empreendimentos/workspace/WorkspaceLayout";
export default async function Page() {

  const { data } =
    await listarEmpreendimentos();

  return (

    <div className="space-y-10">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">

            Empreendimentos

          </h1>

          <p className="mt-2 text-slate-500">

            Gerencie todos os empreendimentos.

          </p>

        </div>

        <Link
          href="/empreendimentos/novo"
          className="rounded-xl bg-[#C8A96A] px-6 py-3 font-semibold text-white"
        >

          Novo Empreendimento

        </Link>

      </div>

      <EmpreendimentosGrid
        empreendimentos={data ?? []}
      />

    </div>

  );

}