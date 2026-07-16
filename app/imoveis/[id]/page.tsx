import AppShell from "@/components/app/AppShell";
import ImovelDetalhesPage from "@/features/imoveis/pages/ImovelDetalhesPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <ImovelDetalhesPage id={id} />
    </AppShell>
  );
}
