import AppShell from "@/components/app/AppShell";
import NovoImovelPage from "@/features/imoveis/pages/NovoImovelPage";

export default function Page() {
  return (
    <AppShell somenteMaster>
      <NovoImovelPage />
    </AppShell>
  );
}
