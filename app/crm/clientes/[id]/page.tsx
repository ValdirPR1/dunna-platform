import AppShell from "@/components/app/AppShell";
import ClienteDetalhesPage from "@/features/crm/pages/ClienteDetalhesPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <ClienteDetalhesPage id={id} />
    </AppShell>
  );
}
