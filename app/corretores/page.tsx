import AppShell from "@/components/app/AppShell";
import CorretoresPage from "@/features/corretores/pages/CorretoresPage";

export default function Page() {
  return (
    <AppShell somenteMaster>
      <CorretoresPage />
    </AppShell>
  );
}
