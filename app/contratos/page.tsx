import AppShell from "@/components/app/AppShell";
import ContratosPage from "@/features/contratos/pages/ContratosPage";

export default function Page() {
  return (
    <AppShell somenteMaster>
      <ContratosPage />
    </AppShell>
  );
}
