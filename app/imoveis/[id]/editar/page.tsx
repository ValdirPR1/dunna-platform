import AppShell from "@/components/app/AppShell";
import EditarImovelPage from "@/features/imoveis/pages/EditarImovelPage";

export default function Page() {
  return (
    <AppShell somenteMaster>
      <EditarImovelPage />
    </AppShell>
  );
}
