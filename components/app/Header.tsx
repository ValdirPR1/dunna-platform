"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { contarTarefasDeHoje } from "@/features/agenda/services/tarefas.service";
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
  const [tarefasHoje, setTarefasHoje] = useState(0);

  useEffect(() => {
    contarTarefasDeHoje().then(setTarefasHoje);
  }, []);
  const ref = useRef<HTMLDivElement>(null);

  async function handleSair() {
    await logout();
    router.push("/login");
  }

  return (

    <header className="sticky top-0 z-30 flex h-20 min-w-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 md:px-8">

      <div className="flex items-center gap-4">

        <button
          onClick={onAbrirMenu}
          aria-label="Abrir menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden lg:block">

          <div className="flex items-center gap-2 text-sm text-slate-400">

            <span>Dunna Platform</span>

            <ChevronRight size={15} />

            <span>{getPageTitle(pathname)}</span>

          </div>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">

            {getPageTitle(pathname)}

          </h1>

        </div>

      </div>

      {/* Título mobile: participa do flex normal (não absolute),
          ocupa o espaço que sobra entre o menu e os ícones e
          centraliza dentro dele — nunca sobrepõe os ícones */}
      <h1 className="min-w-0 flex-1 truncate text-center text-lg font-bold text-slate-900 lg:hidden">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-2 md:gap-5">

        {/* A busca só aparece a partir do mesmo ponto em que o
            cabeçalho "desktop" (breadcrumb + título) aparece (lg).
            Antes ela surgia em md (768px), uma faixa de largura em
            que o menu hambúrguer + título central mobile ainda
            estavam visíveis — a soma de tudo não cabia e o cabeçalho
            quebrava/desconfigurava nessa faixa intermediária. */}
        <div className="relative hidden lg:block">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Pesquisar..."
            className="h-11 w-[220px] rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none focus:border-[#C8A96A] xl:w-[350px]"
          />

        </div>

        <button
          onClick={() => router.push("/agenda")}
          title="Ir pra Agenda"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 md:h-11 md:w-11"
        >

          <CalendarDays size={19} />

          {tarefasHoje > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 font-sans text-[10px] font-bold text-white">
              {tarefasHoje}
            </span>
          )}

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
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 hover:bg-slate-50 md:gap-3 md:px-4"
          >

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C8A96A] font-bold text-white md:h-10 md:w-10">

              {iniciais(usuario.nome)}

            </div>

            <div className="hidden max-w-[140px] text-left sm:block lg:max-w-none">

              <p className="truncate font-semibold text-slate-900">

                {usuario.nome}

              </p>

              <p className="truncate text-sm text-slate-500">

                {usuario.papel === "master" ? "Master" : "Corretor"} • Dunna

              </p>

            </div>

            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />

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
