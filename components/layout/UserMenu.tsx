"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 hover:border-[#C8A96A]"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C8A96A] font-bold text-black">
          V
        </div>

        <div className="text-left">
          <p className="font-semibold text-white">
            Valdir Pereira
          </p>

          <p className="text-xs text-zinc-500">
            Administrador
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">

          <MenuItem
            icon={<User size={18} />}
            label="Meu Perfil"
          />

          <MenuItem
            icon={<Settings size={18} />}
            label="Configurações"
          />

          <div className="my-2 border-t border-zinc-800" />

          <MenuItem
            icon={<LogOut size={18} />}
            label="Sair"
            danger
          />

        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 px-5 py-4 text-left transition ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}