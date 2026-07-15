"use client";

import EmpreendimentoHeader from "../components/EmpreendimentoHeader";
import EmpreendimentoKPIs from "../components/EmpreendimentoKPIs";
import EmpreendimentoFilters from "../components/EmpreendimentoFilters";
import EmpreendimentosList from "../components/EmpreendimentosList";

export default function EmpreendimentosPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">

      <EmpreendimentoHeader />

      <div className="mt-8">
        <EmpreendimentoKPIs />
      </div>

      <div className="mt-8">
        <EmpreendimentoFilters />
      </div>

      <div className="mt-10">
        <EmpreendimentosList />
      </div>

    </main>
  );
}