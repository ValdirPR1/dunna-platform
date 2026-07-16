"use client";

import { useState } from "react";

const tabs = [
  "Dashboard",
  "Unidades",
  "Galeria",
  "Documentos",
  "Financeiro",
  "Marketing",
  "Histórico",
  "Advisor IA",
];

interface Props {
  active: string;
  onChange(tab: string): void;
}

export default function WorkspaceMenu({
  active,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

      <div className="flex flex-wrap gap-2">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              active === tab
                ? "bg-[#C8A96A] text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

    </div>
  );
}