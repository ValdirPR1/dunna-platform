"use client";

import { Bell, FileText, UserPlus, CalendarDays, X } from "lucide-react";

interface NotificationsProps {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  {
    icon: UserPlus,
    title: "Novo lead cadastrado",
    description: "João Pedro demonstrou interesse em Porto de Galinhas.",
    time: "Agora",
  },
  {
    icon: FileText,
    title: "Contrato enviado",
    description: "Contrato encaminhado para assinatura digital.",
    time: "10 min",
  },
  {
    icon: CalendarDays,
    title: "Reunião agendada",
    description: "Construtora Atlântico • 15:00",
    time: "Hoje",
  },
];

export default function Notifications({
  open,
  onClose,
}: NotificationsProps) {
  return (
    <div
      className={`fixed right-0 top-0 z-50 h-screen w-[420px] border-l border-zinc-800 bg-[#111111] shadow-2xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 p-6">

        <div className="flex items-center gap-3">

          <Bell className="text-[#C8A96A]" />

          <h2 className="text-xl font-bold">
            Notificações
          </h2>

        </div>

        <button onClick={onClose}>

          <X />

        </button>

      </div>

      <div className="space-y-4 p-6">

        {notifications.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >

              <div className="flex gap-4">

                <div className="rounded-xl bg-[#C8A96A]/10 p-3">

                  <Icon
                    className="text-[#C8A96A]"
                    size={20}
                  />

                </div>

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-400">
                    {item.description}
                  </p>

                  <p className="mt-3 text-xs text-zinc-500">
                    {item.time}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}