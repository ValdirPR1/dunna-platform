"use client";

interface Props {
  aba: string;
  setAba: (aba: string) => void;
}

const tabs = [
  "Visão Geral",
  "Galeria",
  "Unidades",
  "Documentos",
  "Mapa",
  "Histórico",
];

export default function Tabs({
  aba,
  setAba,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2">

      <div className="flex gap-2">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => setAba(tab)}
            className={`rounded-xl px-5 py-3 transition ${
              aba === tab
                ? "bg-[#C8A96A] font-semibold text-black"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

    </div>
  );
}