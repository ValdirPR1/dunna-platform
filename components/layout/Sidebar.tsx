"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Boxes,
  Users,
  Building2,
  CalendarDays,
  Wallet,
  Megaphone,
  BrainCircuit,
  Settings,
  ChevronRight,
} from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Inventário",
    href: "/imoveis",
    icon: Boxes,
  },
  {
    label: "Pessoas",
    href: "/pessoas",
    icon: Users,
  },
  {
    label: "Empreendimentos",
    href: "/empreendimentos",
    icon: Building2,
  },
  {
    label: "Agenda",
    href: "/agenda",
    icon: CalendarDays,
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
  },
  {
    label: "Marketing",
    href: "/marketing",
    icon: Megaphone,
  },
  {
    label: "Advisor IA",
    href: "/advisor",
    icon: BrainCircuit,
  },
];
export default function AppSidebar() {

  const pathname = usePathname();

  return (

    <aside className="flex h-screen w-[270px] flex-col border-r border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-8 py-7">

        <Image
          src="/logo/dunna-platform.png"
          width={180}
          height={45}
          alt="Dunna"
          priority
        />

      </div>

      <div className="px-5 pt-6">

        <div className="rounded-2xl bg-[#C8A96A] p-5 text-white shadow">

          <p className="text-xs uppercase tracking-widest opacity-80">

            Hoje

          </p>

          <h2 className="mt-2 text-3xl font-bold">

            14

          </h2>

          <p className="mt-1 text-sm">

            Leads aguardando atendimento

          </p>

        </div>

      </div>

      <nav className="mt-8 flex-1 px-4">

        {menu.map((item) => {

          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (

            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 flex items-center justify-between rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-[#F5EFE4] text-[#A67C2E]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >

              <div className="flex items-center gap-3">

                <Icon size={20} />

                <span className="font-medium">

                  {item.label}

                </span>

              </div>

              {active && <ChevronRight size={18} />}

            </Link>

          );

        })}

      </nav>

      <div className="border-t border-slate-200 p-5">

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-100">

          <Settings size={20} />

          Configurações

        </button>

      </div>

    </aside>

  );

}