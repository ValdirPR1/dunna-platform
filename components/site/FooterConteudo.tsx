"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, MessageCircle } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/shared/icons/BrandIcons";
import { useIdioma } from "@/features/idioma/IdiomaContext";

interface Props {
  whatsapp: string | undefined;
  whatsappLink: string | null;
  email: string | undefined;
  endereco: string | undefined;
  instagramLink: string | null;
  youtubeLink: string | null;
}

export default function FooterConteudo({
  whatsapp,
  whatsappLink,
  email,
  endereco,
  instagramLink,
  youtubeLink,
}: Props) {
  const { t } = useIdioma();

  const links = [
    { href: "/site", label: t.footer.links.home },
    { href: "/site/imoveis", label: t.footer.links.imoveis },
    { href: "/site/empreendimentos", label: t.footer.links.empreendimentos },
    { href: "/site/vender", label: t.footer.links.vender },
    { href: "/site/blog", label: t.footer.links.blog },
    { href: "/site/avaliacoes", label: t.footer.links.avaliacoes },
    { href: "/site/sobre", label: t.footer.links.sobre },
    { href: "/site/contato", label: t.footer.links.contato },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] py-20 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">

          {/* Sobre */}

          <div>

            <Image
              src="/logo/dunna-site-branco.png"
              alt="Dunna Imob"
              width={1024}
              height={239}
              className="h-10 w-auto"
            />

            <p className="mt-6 max-w-sm font-sans font-light leading-8 text-white/60">
              {t.footer.descricao}
            </p>

            <p className="rotulo-luxo mt-6 text-white/40">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-gold hover:text-gold-light"
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-gold hover:text-gold-light"
                  >
                    <YoutubeIcon size={18} />
                  </a>
                )}

              </div>
            )}

          </div>

          {/* Navegação */}

          <div>

            <h3 className="rotulo-luxo text-gold-light">
              {t.footer.navegacao}
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans font-light text-white/65 transition hover:text-gold-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          </div>

          {/* Contato */}

          <div>

            <h3 className="rotulo-luxo text-gold-light">
              {t.footer.contato}
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans font-light text-white/65 transition hover:text-gold-light"
                >
                  <MessageCircle size={18} className="shrink-0" />
                  {whatsapp}
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 font-sans font-light text-white/65 transition hover:text-gold-light"
                >
                  <Mail size={18} className="shrink-0" />
                  {email}
                </a>
              )}

              {endereco && (
                <p className="flex items-start gap-2 font-sans font-light text-white/65">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  {endereco}
                </p>
              )}

            </div>

          </div>

        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm font-light text-white/40 sm:flex-row sm:items-center sm:justify-between">

          <p>© {new Date().getFullYear()} Dunna Imob. {t.footer.direitosReservados}</p>

          <p>CRECI 19602-J</p>

        </div>

      </div>

    </footer>
  );
}
