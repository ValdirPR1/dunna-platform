import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";
import FooterConteudo from "./FooterConteudo";

// Só busca os dados (configurações da empresa) — quem desenha e
// traduz o rodapé é o FooterConteudo (client component, usa o
// idioma escolhido no site).
export default async function Footer() {
  const config = await obterConfiguracoes();

  const whatsapp = config.empresa_whatsapp;
  const email = config.empresa_email;
  const endereco = config.empresa_endereco;
  const instagram = config.empresa_instagram;
  const youtube = config.empresa_youtube;

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : null;

  // Aceita tanto "@dunnaimob" quanto o link completo colado direto do
  // navegador — o campo em Configurações não obriga um formato só.
  const instagramLink = instagram
    ? instagram.startsWith("http")
      ? instagram
      : `https://instagram.com/${instagram.replace(/^@/, "")}`
    : null;

  const youtubeLink = youtube
    ? youtube.startsWith("http")
      ? youtube
      : `https://youtube.com/${youtube.startsWith("@") ? youtube : `@${youtube}`}`
    : null;

  return (
    <FooterConteudo
      whatsapp={whatsapp}
      whatsappLink={whatsappLink}
      email={email}
      endereco={endereco}
      instagramLink={instagramLink}
      youtubeLink={youtubeLink}
    />
  );
}
