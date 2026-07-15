"use client";

import { useParams } from "next/navigation";
import UnidadeWizard from "../components/UnidadeWizard";

export default function NovaUnidadePage() {

  const params = useParams();

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Nova Unidade
        </h1>

        <p className="mt-2 text-zinc-500">
          Cadastre uma unidade deste empreendimento.
        </p>

      </div>

      <UnidadeWizard
        empreendimentoId={params.id as string}
      />

    </div>

  );

}