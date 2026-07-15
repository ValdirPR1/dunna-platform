"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  UserRound,
  BarChart3,
  CalendarDays,
  Wallet,
  Sparkles,
  Plus,
  Globe,
  FileText,
  BadgeDollarSign,
  Settings,
  Shield,
  Plug,
  ChevronRight,
} from "lucide-react";

const menu = [
  {
    title: "GERAL",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Análises",
        href: "/analises",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "NEGÓCIOS",
    items: [
      {
        label: "Empreendimentos",
        href: "/empreendimentos",
        icon: Building2,
      },
      {
        label: "Unidades",
        href: "/unidades",
        icon: Home,
      },
    ],
  },

  {
    title: "CRM",
    items: [
      {
        label: "Leads",
        href: "/leads",
        icon: Sparkles,
      },
      {
        label: "Clientes",
        href: "/clientes",
        icon: Users,
      },
      {
        label: "Corretores",
        href: "/corretores",
        icon: UserRound,
      },
      {
        label: "Agenda",
        href: "/agenda",
        icon: CalendarDays,
      },
    ],
  },

  {
    title: "FINANCEIRO",
    items: [
      {
        label: "Financeiro",
        href: "/financeiro",
        icon: Wallet,
      },
      {
        label: "Contratos",
        href: "/contratos",
        icon: FileText,
      },
      {
        label: "Comissões",
        href: "/comissoes",
        icon: BadgeDollarSign,
      },
    ],
  },

  {
    title: "MARKETING",
    items: [
      {
        label: "Site",
        href: "/site",
        icon: Globe,
      },
      {
        label: "Landing Pages",
        href: "/landing-pages",
        icon: Globe,
      },
      {
        label: "Blog",
        href: "/blog",
        icon: FileText,
      },
    ],
  },

  {
    title: "CONFIGURAÇÕES",
    items: [
      {
        label: "Usuários",
        href: "/usuarios",
        icon: Users,
      },
      {
        label: "Permissões",
        href: "/permissoes",
        icon: Shield,
      },
      {
        label: "Integrações",
        href: "/integracoes",
        icon: Plug,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-80 flex-col border-r border-zinc-800 bg-[#0B0B0C]">

      {/* Logo */}

      <div className="border-b border-zinc-800 px-8 py-8">

        <div className="flex justify-center">

          <Image
            src="/logo/dunna-platform.png"
            alt="Dunna Platform"
            width={220}
            height={60}
            priority
            className="h-auto w-auto"
          />

        </div>

        <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-emerald-900 bg-emerald-500/10 py-3">

          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-sm font-medium text-emerald-300">
            Sistema Online
          </span>

        </div>

      </div>

      {/* Botão principal */}

      <div className="px-8 py-8">

        <button
          onClick={() => router.push("/empreendimentos/novo")}
          className="flex h-16 w-full items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-[#B68B2C] to-[#D9B56D] text-lg font-semibold text-black shadow-lg transition duration-300 hover:scale-[1.02] hover:brightness-110"
        >

          <Plus size={22} />

          Novo Empreendimento

        </button>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-5">

        {menu.map((section) => (

          <div
            key={section.title}
            className="mb-10"
          >

            <p className="mb-4 px-4 text-xs font-semibold tracking-[0.30em] text-zinc-500 uppercase">

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
                  className={`group mb-2 flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-200 ${
                    active
                      ? "border border-[#C8A96A]/30 bg-gradient-to-r from-[#C8A96A]/15 to-[#C8A96A]/5 text-[#E4C27A] shadow-lg"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <Icon
                      size={22}
                      className={
                        active
                          ? "text-[#E4C27A]"
                          : ""
                      }
                    />

                    <span className="text-[15px] font-medium">

                      {item.label}

                    </span>

                  </div>

                  <ChevronRight
                    size={18}
                    className={`transition-all duration-300 ${
                      active
                        ? "translate-x-0 opacity-100"
                        : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />

                </Link>

              );

            })}

          </div>

        ))}

      </div>

      {/* Rodapé */}

      <div className="border-t border-zinc-800 bg-[#090909] px-8 py-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-semibold text-white">

              Dunna Platform

            </p>

            <p className="mt-1 text-xs text-zinc-500">

              Release Candidate • v0.1

            </p>

            <div className="mt-3 flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-emerald-400">

                Online

              </span>

            </div>

          </div>

          <button
            onClick={() => router.push("/configuracoes")}
            className="rounded-xl p-3 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
          >

            <Settings size={20} />

          </button>

        </div>

      </div>

    </aside>
  );
}