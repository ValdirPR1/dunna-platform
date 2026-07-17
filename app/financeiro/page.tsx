import AppShell from "@/components/app/AppShell";
import FinanceiroPage from "@/features/financeiro/pages/FinanceiroPage";

export default function Page() {
  return (
    <AppShell somenteMaster>
      <FinanceiroPage />
    </AppShell>
  );
}
