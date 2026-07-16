"use client";

import {
  Bell,
  CalendarDays,
  Plus,
  Search,
  ChevronRight,
} from "lucide-react";

import { usePathname } from "next/navigation";

function getPageTitle(pathname: string) {
  const routes: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/empreendimentos": "Empreendimentos",
    "/imoveis": "Imóveis",
    "/crm/leads": "Leads",
    "/crm/clientes": "Clientes",
    "/financeiro": "Financeiro",
    "/advisor": "Advisor IA",
    "/mercado": "Radar de Mercado",
    "/site": "Site",
    "/configuracoes": "Configurações",
  };

  return routes[pathname] ?? "Dashboard";
}

export default function Header() {

  const pathname = usePathname();

  return (

    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

      <div>

        <div className="flex items-center gap-2 text-sm text-slate-400">

          <span>Dunna Platform</span>

          <ChevronRight size={15} />

          <span>{getPageTitle(pathname)}</span>

        </div>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">

          {getPageTitle(pathname)}

        </h1>

      </div>

      <div className="flex items-center gap-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Pesquisar..."
            className="h-11 w-[350px] rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none focus:border-[#C8A96A]"
          />

        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100">

          <CalendarDays size={19} />

        </button>

        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100">

          <Bell size={19} />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500"/>

        </button>

        <button className="flex items-center gap-2 rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-[#101828] hover:brightness-105">

          <Plus size={18}/>

          Novo

        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8A96A] font-bold text-white">

            VP

          </div>

          <div>

            <p className="font-semibold text-slate-900">

              Valdir Pereira

            </p>

            <p className="text-sm text-slate-500">

              CEO • Dunna

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}