import AppShell from "@/components/app/AppShell";
import EditarEmpreendimentoPage from "@/features/empreendimentos/pages/EditarEmpreendimentoPage";

export default function Page() {
  return (
    <AppShell somenteMaster>
      <EditarEmpreendimentoPage />
    </AppShell>
  );
}
