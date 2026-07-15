"use client";

import {
  FileText,
  UserPlus,
  Building2,
  Bell,
} from "lucide-react";

const activities = [
  {
    icon: UserPlus,
    title: "Novo lead cadastrado",
    time: "Há 5 minutos",
  },
  {
    icon: FileText,
    title: "Contrato enviado",
    time: "Há 20 minutos",
  },
  {
    icon: Building2,
    title: "Empreendimento atualizado",
    time: "Hoje",
  },
  {
    icon: Bell,
    title: "Nova tabela disponível",
    time: "Hoje",
  },
];

export default function ActivityCard() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-7">
      <h2 className="mb-6 text-2xl font-bold">
        Atividades Recentes
      </h2>

      <div className="space-y-4">
        {activities.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl bg-zinc-800/40 p-4"
            >
              <div className="rounded-xl bg-[#C8A96A]/10 p-3">
                <Icon
                  size={20}
                  className="text-[#C8A96A]"
                />
              </div>

              <div>
                <p className="font-medium">
                  {item.title}
                </p>

                <p className="text-sm text-zinc-500">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}