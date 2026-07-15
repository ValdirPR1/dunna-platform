"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  MessageCircle,
  Search,
  Plus,
} from "lucide-react";

import Notifications from "./Notifications";
import UserMenu from "./UserMenu";

export default function Topbar() {
  const [time, setTime] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-24 items-center justify-between border-b border-zinc-800 bg-[#111111]/90 px-10 backdrop-blur-xl">

        {/* Busca */}

        <div className="relative w-[520px]">

          <Search
            size={20}
            className="absolute left-5 top-4 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Buscar empreendimento, cliente ou lead..."
            className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900 pl-14 pr-5 text-white outline-none transition focus:border-[#C8A96A]"
          />

        </div>

        {/* Ações */}

        <div className="flex items-center gap-4">

          {/* Hora */}

          <div className="mr-2 text-right">

            <p className="text-xl font-bold text-[#C8A96A]">
              {time}
            </p>

            <p className="text-xs text-zinc-500">
              Sistema Online
            </p>

          </div>

          {/* Agenda */}

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-[#C8A96A] hover:text-white">

            <CalendarDays size={20} />

          </button>

          {/* WhatsApp */}

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-[#C8A96A] hover:text-white">

            <MessageCircle size={20} />

          </button>

          {/* Notificações */}

          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-[#C8A96A] hover:text-white"
          >

            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />

          </button>

          {/* Novo Lead */}

          <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#B68B2C] to-[#D9B56D] px-5 py-3 font-semibold text-black transition hover:brightness-110">

            <Plus size={18} />

            Novo Lead

          </button>

          {/* Usuário */}

          <UserMenu />

        </div>

      </header>

      <Notifications
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}