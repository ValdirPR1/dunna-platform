"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useIdioma } from "@/features/idioma/IdiomaContext";
import LanguageSwitcher from "@/features/idioma/LanguageSwitcher";

function NavLink({
  href,
  label,
  claro,
}: {
  href: string;
  label: string;
  claro: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/site" ? pathname === "/site" : pathname.startsWith(href);

  const textClass = claro
    ? "text-white/90 hover:text-white"
    : isActive
      ? "text-gold-dark"
      : "text-navy hover:text-gold-dark";

  return (
    <Link
      href={href}
      className={"rotulo-luxo group relative py-2 transition-colors " + textClass}
    >
      {label}
      <span
        className={
          "absolute left-0 -bottom-0.5 h-px bg-gold transition-all duration-500 " +
          (isActive ? "w-full" : "w-0 group-hover:w-full")
        }
      />
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const { t } = useIdioma();

  // Na home o cabeçalho flutua transparente sobre a foto do topo
  // (texto branco) e só ganha fundo quando a pessoa rola a página.
  // Nas demais páginas ele já nasce com fundo claro.
  const naHome = pathname === "/site";
  const transparente = naHome && !scrolled && !menuAberto;

  // "Empreendimentos" saiu do menu horizontal do desktop (com o
  // seletor de idioma, tava apertando demais e quebrando linha) —
  // continua acessível pelo botão no Hero e pelo rodapé. No menu
  // mobile não tem esse problema de espaço (é uma lista vertical),
  // então ele continua lá.
  const links = [
    { href: "/site", label: t.navbar.home },
    { href: "/site/imoveis", label: t.navbar.imoveis },
    { href: "/site/vender", label: t.navbar.vender },
    { href: "/site/sobre", label: t.navbar.sobre },
    { href: "/site/contato", label: t.navbar.contato },
  ];

  const linksMobile = [
    links[0],
    links[1],
    { href: "/site/empreendimentos", label: t.navbar.empreendimentos },
    ...links.slice(2),
  ];

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha o menu mobile sozinho quando a pessoa navega pra outra página
  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  const headerClass = transparente
    ? "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-gradient-to-b from-black/50 to-transparent transition-all duration-500"
    : "fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-[#f5f1ec]/95 backdrop-blur transition-all duration-500";

  return (
    <>
      <header className={headerClass}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/site"
            aria-label="Dunna"
            className="flex flex-1 justify-center lg:flex-none lg:justify-start"
          >

            <Image
              src={
                transparente
                  ? "/logo/dunna-site-branco.png"
                  : "/logo/dunna-site-recortado.png"
              }
              alt="Dunna"
              width={1024}
              height={236}
              priority
              className="h-9 w-auto sm:h-10"
            />

          </Link>

          <nav className="hidden items-center gap-9 lg:flex">

            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                claro={transparente}
              />
            ))}

          </nav>

          <div className="flex items-center gap-4">

            <LanguageSwitcher className="hidden lg:flex" claro={transparente} />

            <a
              href="https://wa.me/5581996825134"
              target="_blank"
              rel="noopener noreferrer"
              className={
                "rotulo-luxo hidden items-center gap-2 border px-6 py-3 transition-all duration-300 sm:flex " +
                (transparente
                  ? "border-white/60 text-white hover:bg-white hover:text-navy"
                  : "border-navy text-navy hover:bg-navy hover:text-white")
              }
            >
              {t.navbar.falarEspecialista}
            </a>

            <button
              onClick={() => setMenuAberto((v) => !v)}
              aria-label="Abrir menu"
              className={
                "flex h-11 w-11 items-center justify-center border lg:hidden " +
                (transparente
                  ? "border-white/40 text-white"
                  : "border-slate-300 text-navy")
              }
            >
              {menuAberto ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>

        {/* Menu mobile */}

        {menuAberto && (
          <div className="border-t border-slate-200 bg-[#f5f1ec] px-6 py-8 lg:hidden">

            <LanguageSwitcher className="mb-6 w-fit" />

            <nav className="flex flex-col">
              {linksMobile.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-slate-200 py-4 font-display text-2xl font-light text-navy transition hover:text-gold-dark"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <a
              href="https://wa.me/5581996825134"
              target="_blank"
              rel="noopener noreferrer"
              className="rotulo-luxo mt-8 flex items-center justify-center bg-navy px-6 py-4 text-white"
            >
              {t.navbar.falarEspecialista}
            </a>

            <p className="mt-4 text-center text-xs text-slate-400">
              CRECI 19602-J
            </p>

          </div>
        )}

      </header>

      {/* Espaço reservado nas páginas internas (o cabeçalho é fixo e,
          sem isso, cobriria o topo do conteúdo). Na home não precisa:
          lá ele flutua de propósito sobre a foto. */}
      {!naHome && <div className="h-20" aria-hidden="true" />}
    </>
  );
}
