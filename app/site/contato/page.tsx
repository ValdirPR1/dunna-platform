import type { Metadata } from "next";
import ContatoConteudo from "@/features/site/components/ContatoConteudo";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";

export const metadata: Metadata = {
  title: "Fale com a gente | Dunna Imob",
  description:
    "Entre em contato com a Dunna Imob. Preencha o formulário e um de nossos especialistas te ajuda a encontrar o imóvel ideal em Porto de Galinhas, Muro Alto, Praia dos Carneiros, Tamandaré e São Miguel dos Milagres.",
  alternates: {
    canonical: "/site/contato",
  },
};

export default async function ContatoPage() {
  // Antes esses três dados vinham fixos ("(00) 00000-0000" etc.) —
  // agora usa a mesma fonte (Configurações) que o rodapé já usa, pra
  // não ficar um canal de contato desatualizado/placeholder na página.
  const config = await obterConfiguracoes().catch(() => ({}) as Record<string, string>);

  return (
    <ContatoConteudo
      whatsapp={config.empresa_whatsapp}
      email={config.empresa_email}
      endereco={config.empresa_endereco}
    />
  );
}
