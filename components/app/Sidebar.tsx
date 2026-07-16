"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  UserCog,
  Building2,
  Home,
  Sparkles,
  LineChart,
  Globe,
  Megaphone,
  Wallet,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const sections: MenuSection[] = [
  {
    title: "PAINEL",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
      },
    ],
  },

  {
    title: "CRM",
    items: [
      {
        icon: Users,
        label: "Leads",
        href: "/crm/leads",
        badge: 14,
      },
      {
        icon: UserRound,
        label: "Clientes",
        href: "/crm/clientes",
      },
      {
        icon: CalendarDays,
        label: "Agenda",
        href: "/agenda",
        badge: 6,
      },
      {
        icon: UserCog,
        label: "Corretores",
        href: "/corretores",
      },
    ],
  },

  {
    title: "IMÓVEIS",
    items: [
      {
        icon: Building2,
        label: "Empreendimentos",
        href: "/empreendimentos",
      },
      {
        icon: Home,
        label: "Imóvel",
        href: "/imoveis",
      },
    ],
  },

  {
    title: "INTELIGÊNCIA",
    items: [
      {
        icon: Sparkles,
        label: "Advisor IA",
        href: "/advisor",
        badge: 3,
      },
      {
        icon: LineChart,
        label: "Radar Mercado",
        href: "/mercado",
      },
    ],
  },

  {
    title: "MARKETING",
    items: [
      {
        icon: Globe,
        label: "Site",
        href: "/site",
      },
      {
        icon: Megaphone,
        label: "Landing Pages",
        href: "/landing-pages",
      },
    ],
  },

  {
    title: "FINANCEIRO",
    items: [
      {
        icon: Wallet,
        label: "Financeiro",
        href: "/financeiro",
      },
      {
        icon: FileText,
        label: "Contratos",
        href: "/contratos",
      },
    ],
  },

  {
    title: "CONFIGURAÇÕES",
    items: [
      {
        icon: Settings,
        label: "Configurações",
        href: "/configuracoes",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[290px] shrink-0 flex-col border-r border-slate-800 bg-[#101828] text-white">
      {/* LOGO */}

      <div className="border-b border-slate-800 px-8 py-10">

        <div className="flex justify-center transition duration-300 hover:scale-[1.02]">

          <Image
            src="/logo/dunna-platform.png"
            alt="Dunna Platform"
            width={200}
            height={60}
            priority
          />

        </div>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-3">

          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-sm font-medium text-emerald-300">

            Sistema Online

          </span>

        </div>

      </div>

      {/* MENU */}

      <div className="flex-1 overflow-y-auto px-5 py-8">

        {sections.map((section) => (

          <div key={section.title} className="mb-10">

            <p className="mb-4 px-4 text-[11px] font-bold uppercase tracking-[0.35em] text-slate-500">

              {section.title}

            </p>

            {section.items.map((item) => {

              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (

               <Link
  key={item.href}
  href={item.href}
  className={`group relative mb-2 flex items-center rounded-2xl px-4 py-3 transition-all duration-300 ${
    active
      ? "bg-slate-800 text-white shadow-lg"
      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
  }`}
>

  {active && (
    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#C8A96A]" />
  )}

  <Icon
    size={18}
    strokeWidth={1.8}
    className={`mr-4 transition-all duration-300 ${
      active
        ? "text-[#C8A96A]"
        : "group-hover:text-[#C8A96A]"
    }`}
  />

  <span className="flex-1 text-[15px] font-semibold tracking-tight">

    {item.label}

  </span>

  {item.badge && (
    <div className="flex h-6 min-w-[26px] items-center justify-center rounded-full bg-slate-700 px-2 text-[11px] font-bold text-white">

      {item.badge}

    </div>
  )}

  <ChevronRight
    size={16}
    className={`ml-3 transition-all duration-300 ${
      active
        ? "opacity-100 text-[#C8A96A]"
        : "opacity-0 group-hover:opacity-50"
    }`}
  />

</Link>

              );

            })}

          </div>

        ))}

      </div>

      {/* RODAPÉ */}

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur">

          <div className="flex items-center justify-between">

            <p className="text-[11px] font-semibold uppercase tracking-[0.30em] text-slate-500">

              Advisor IA

            </p>

            <Sparkles
              size={16}
              className="text-[#C8A96A]"
            />

          </div>

          <p className="mt-4 text-sm font-medium text-white">

            Sistema saudável

          </p>

          <p className="mt-2 text-xs text-slate-400">

            Nenhum alerta crítico encontrado.

          </p>

          <div className="mt-5 flex items-center">

            <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs text-emerald-300">

              Última sincronização • Agora

            </span>

          </div>

        </div>

        <p className="mt-5 text-center text-xs tracking-wide text-slate-500">

          Dunna Platform v1.0

        </p>

      </div>

    </aside>
  );
}