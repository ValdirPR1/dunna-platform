import DashboardLayout from "@/components/layout/DashboardLayout";
import NovoEmpreendimentoPage from "@/features/empreendimentos/pages/NovoEmpreendimentoPage";

export default function Page() {
  return (
    <DashboardLayout>
      <NovoEmpreendimentoPage />
    </DashboardLayout>
  );
}