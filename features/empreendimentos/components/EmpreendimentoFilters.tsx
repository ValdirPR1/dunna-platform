"use client";

import Input from "@/components/ui/Input";

export default function EmpreendimentoFilters() {
  return (
    <div className="flex gap-4">

      <Input
        placeholder="Buscar empreendimento..."
      />

      <button className="bg-zinc-800 px-6 rounded-lg">
        Filtros
      </button>

    </div>
  );
}