import DashboardLayout from "@/components/layout/DashboardLayout";
import EmpreendimentosPage from "@/features/empreendimentos/pages/EmpreendimentosPage";

export default function Page() {
  return (
    <DashboardLayout>
      <EmpreendimentosPage />
    </DashboardLayout>
  );
}