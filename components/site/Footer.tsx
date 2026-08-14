import Link from "next/link";
import { MapPin, Mail, MessageCircle } from "lucide-react";
import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";
import { InstagramIcon, YoutubeIcon } from "@/components/shared/icons/BrandIcons";

const LINKS = [
  { href: "/site", label: "Home" },
  { href: "/site/imoveis", label: "Imóveis" },
  { href: "/site/empreendimentos", label: "Empreendimentos" },
  { href: "/site/vender", label: "Vender meu imóvel" },
  { href: "/site/blog", label: "Blog" },
  { href: "/site/avaliacoes", label: "Avaliações" },
  { href: "/site/sobre", label: "Sobre" },
  { href: "/site/contato", label: "Contato" },
];

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
    <footer className="mt-24 bg-[#101828] py-16 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">

          {/* Sobre */}

          <div>

            <h2 className="text-3xl font-bold">
              Dunna Imob
            </h2>

            <p className="mt-4 max-w-sm text-slate-300">
              Especialistas em imóveis de praia em Porto de Galinhas,
              Praia dos Carneiros e Tamandaré.
            </p>

            <p className="mt-4 font-sans text-sm text-slate-400">
              CRECI 19602-J
            </p>

            {(instagramLink || youtubeLink) && (
              <div className="mt-5 flex items-center gap-3">

                {instagramLink && (
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-gold hover:text-gold"
                  >
                    <InstagramIcon size={18} />
                  </a>
                )}

                {youtubeLink && (
                  <a
                    href={youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-gold hover:text-gold"
                  >
                    <YoutubeIcon size={18} />
                  </a>
                )}

              </div>
            )}

          </div>

          {/* Navegação */}

          <div>

            <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-slate-400">
              Navegação
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-slate-300 transition hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          </div>

          {/* Contato */}

          <div>

            <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-slate-400">
              Contato
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-slate-300 transition hover:text-gold"
                >
                  <MessageCircle size={18} className="shrink-0" />
                  {whatsapp}
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 font-sans text-slate-300 transition hover:text-gold"
                >
                  <Mail size={18} className="shrink-0" />
                  {email}
                </a>
              )}

              {endereco && (
                <p className="flex items-start gap-2 font-sans text-slate-300">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  {endereco}
                </p>
              )}

            </div>

          </div>

        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-slate-700 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <p>© {new Date().getFullYear()} Dunna Imob. Todos os direitos reservados.</p>

          <p>CRECI 19602-J</p>

        </div>

      </div>

    </footer>
  );
}
