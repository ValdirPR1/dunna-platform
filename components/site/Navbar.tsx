"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/site", label: "Home" },
  { href: "/site/imoveis", label: "Imóveis" },
  { href: "/site/empreendimentos", label: "Empreendimentos" },
  { href: "/site/sobre", label: "Sobre" },
  { href: "/site/contato", label: "Contato" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/site" ? pathname === "/site" : pathname.startsWith(href);

  const textClass = isActive ? "text-gold" : "text-navy";

  return (
    <Link href={href} className={"group relative py-2 " + textClass}>
      {label}
      <span
        className={
          "absolute left-0 -bottom-0.5 h-0.5 rounded-full bg-gold transition-all duration-300 " +
          (isActive ? "w-full" : "w-0 group-hover:w-full")
        }
      />
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = scrolled
    ? "sticky top-0 z-50 backdrop-blur transition-all duration-300 border-b border-slate-200 bg-white/90 shadow-sm"
    : "sticky top-0 z-50 backdrop-blur transition-all duration-300 border-b border-transparent bg-white/60 shadow-none";

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link href="/site">

          <Image
            src="/logo/dunna-site.png"
            alt="Dunna"
            width={170}
            height={45}
            style={{ width: "170px", height: "45px" }}
            priority
          />

        </Link>

        <nav className="hidden items-center gap-10 font-sans text-sm font-medium lg:flex">

          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}

        </nav>

        <a
          href="https://wa.me/5581999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gold-dark hover:shadow-lg"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.82.48 3.53 1.317 5.005L2 22l5.11-1.29A9.947 9.947 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18.14a8.106 8.106 0 0 1-4.13-1.128l-.296-.176-3.03.765.81-2.955-.193-.304A8.106 8.106 0 0 1 3.86 12c0-4.494 3.647-8.14 8.14-8.14 4.494 0 8.14 3.646 8.14 8.14 0 4.493-3.646 8.14-8.14 8.14Z" />
          </svg>

          Falar com especialista
        </a>

      </div>
    </header>
  );
}
