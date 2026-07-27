import AppShell from "@/components/app/AppShell";
import EmpreendimentoWizard from "@/features/empreendimentos/forms/EmpreendimentoWizard";

export default function NovoEmpreendimentoPage() {

  return (

    <AppShell somenteMaster>

      <div className="mx-auto max-w-6xl space-y-8">

        <div>

          <h1 className="text-4xl font-bold">

            Novo Empreendimento

          </h1>

          <p className="mt-2 text-slate-500">

            Cadastre um novo empreendimento na plataforma.

          </p>

        </div>

        <EmpreendimentoWizard />

      </div>

    </AppShell>

  );

}