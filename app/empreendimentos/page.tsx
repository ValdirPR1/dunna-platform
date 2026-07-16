"use client";

import EmpreendimentoCard from "@/features/empreendimentos/components/EmpreendimentoCard";

export default function EmpreendimentosPage() {
  return (
    <div>

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Empreendimentos
          </h1>

          <p className="mt-2 text-slate-500">
            Gerencie todos os empreendimentos cadastrados.
          </p>

        </div>

        <button className="rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-[#101828]">
          Novo Empreendimento
        </button>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <EmpreendimentoCard
          nome="Makani Residence"
          cidade="Praia dos Carneiros"
          status="Em obras"
        />

        <EmpreendimentoCard
          nome="Palm Beach"
          cidade="Porto de Galinhas"
          status="Pronto"
        />

        <EmpreendimentoCard
          nome="Casa Mar"
          cidade="Tamandaré"
          status="Lançamento"
        />

      </div>

    </div>
  );
}