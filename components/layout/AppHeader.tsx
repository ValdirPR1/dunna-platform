"use client";

import {
  Bell,
  CalendarDays,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";

export default function AppHeader() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* Pesquisa */}

      <div className="flex w-[520px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-5">

        <Search
          size={18}
          className="text-slate-400"
        />

        <input
          className="ml-4 h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          placeholder="Buscar empreendimento, imóvel, cliente ou lead..."
        />

      </div>

      {/* Ações */}

      <div className="flex items-center gap-5">

        <div className="text-right">

          <p className="text-xs uppercase tracking-widest text-slate-400">
            Hoje
          </p>

          <p className="font-semibold capitalize text-slate-700">
            {hoje}
          </p>

        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition">

          <CalendarDays size={20} />

        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition">

          <MessageCircle size={20} />

        </button>

        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 transition">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

        </button>

        <button className="flex items-center gap-3 rounded-2xl bg-[#C8A96A] px-5 py-3 font-semibold text-black transition hover:brightness-105">

          <Plus size={18} />

          Novo Lead

        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8A96A] font-bold text-white">

            VP

          </div>

          <div>

            <p className="font-semibold text-slate-800">
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