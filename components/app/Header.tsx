"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  LogOut,
  UserPlus,
  Building2,
  Home,
  Menu,
} from "lucide-react";
import NotificacoesDropdown from "@/features/dashboard/components/NotificacoesDropdown";
import { usePathname } from "next/navigation";
import { logout } from "@/features/core/auth/auth.service";
import { UsuarioLogado } from "@/features/core/auth/auth.service";

function getPageTitle(pathname: string) {
  const routes: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/empreendimentos": "Empreendimentos",
    "/imoveis": "Imóveis",
    "/crm/leads": "Leads",
    "/crm/clientes": "Clientes",
    "/agenda": "Agenda",
    "/financeiro": "Financeiro",
    "/advisor": "Advisor IA",
    "/mercado": "Radar de Mercado",
    "/site": "Site",
    "/configuracoes": "Configurações",
  };

  return routes[pathname] ?? "Dashboard";
}

function iniciais(nome: string) {
  const partes = nome.trim().split(" ");
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

interface Props {
  usuario: UsuarioLogado;
  onAbrirMenu?: () => void;
}

export default function Header({ usuario, onAbrirMenu }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuNovoAberto, setMenuNovoAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function handleSair() {
    await logout();
    router.push("/login");
  }

  return (

    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">

      <div className="flex items-center gap-4">

        <button
          onClick={onAbrirMenu}
          aria-label="Abrir menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>

          <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">

            <span>Dunna Platform</span>

            <ChevronRight size={15} />

            <span>{getPageTitle(pathname)}</span>

          </div>

          <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">

            {getPageTitle(pathname)}

          </h1>

        </div>

      </div>

      <div className="flex items-center gap-2 md:gap-5">

        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Pesquisar..."
            className="h-11 w-[350px] rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none focus:border-[#C8A96A]"
          />

        </div>

        <button className="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 sm:flex">

          <CalendarDays size={19} />

        </button>

        <NotificacoesDropdown />

        <div className="relative">

          <button
            onClick={() => setMenuNovoAberto((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-[#C8A96A] px-4 py-3 font-semibold text-[#101828] hover:brightness-105 md:px-5"
          >

            <Plus size={18}/>

            <span className="hidden sm:inline">Novo</span>

          </button>

          {menuNovoAberto && (
            <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

              <button
                onClick={() => {
                  setMenuNovoAberto(false);
                  router.push("/crm/leads?novo=1");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
              >
                <UserPlus size={17} className="text-[#C8A96A]" />
                Novo Lead
              </button>

              <button
                onClick={() => {
                  setMenuNovoAberto(false);
                  router.push("/imoveis/novo");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
              >
                <Home size={17} className="text-[#C8A96A]" />
                Novo Imóvel
              </button>

              <button
                onClick={() => {
                  setMenuNovoAberto(false);
                  router.push("/empreendimentos/novo");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
              >
                <Building2 size={17} className="text-[#C8A96A]" />
                Novo Empreendimento
              </button>

            </div>
          )}

        </div>

        <div ref={ref} className="relative">

          <button
            onClick={() => setMenuAberto((v) => !v)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8A96A] font-bold text-white">

              {iniciais(usuario.nome)}

            </div>

            <div className="text-left">

              <p className="font-semibold text-slate-900">

                {usuario.nome}

              </p>

              <p className="text-sm text-slate-500">

                {usuario.papel === "master" ? "Master" : "Corretor"} • Dunna

              </p>

            </div>

            <ChevronDown size={16} className="text-slate-400" />

          </button>

          {menuAberto && (
            <div className="absolute right-0 top-16 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

              <button
                onClick={handleSair}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 font-sans text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sair
              </button>

            </div>
          )}

        </div>

      </div>

    </header>

  );

}
