"use client";

import { ArrowUpRight, LucideIcon } from "lucide-react";

interface KPIProps {
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
}

export default function KPI({
  title,
  value,
  growth,
  icon: Icon,
}: KPIProps) {
  return (
    <div className="group rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A96A]/40 hover:shadow-xl hover:shadow-[#C8A96A]/10">

      <div className="flex items-center justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8A96A]/10">

          <Icon
            size={24}
            className="text-[#C8A96A]"
          />

        </div>

        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">

          <ArrowUpRight size={15} />

          {growth}

        </div>

      </div>

      <p className="mt-6 text-sm uppercase tracking-wide text-zinc-500">

        {title}

      </p>

      <h2 className="mt-2 text-4xl font-bold text-white">

        {value}

      </h2>

      <p className="mt-1 text-sm text-zinc-500">

        Comparado aos últimos 30 dias

      </p>

      {/* Sparkline */}

      <div className="mt-6 flex h-12 items-end gap-1">

        {[8, 15, 12, 20, 18, 24, 30, 26, 35, 42].map((v, i) => (

          <div
            key={i}
            className="flex-1 rounded-full bg-gradient-to-t from-[#8F6B2A] to-[#E5C87A] transition-all duration-500 group-hover:brightness-110"
            style={{
              height: `${v}px`,
            }}
          />

        ))}

      </div>

    </div>
  );
}