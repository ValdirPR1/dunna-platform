"use client";

import EmpreendimentoHeader from "../components/EmpreendimentoHeader";
import EmpreendimentosList from "../components/EmpreendimentosList";

export default function EmpreendimentosPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <EmpreendimentoHeader />

      <div className="mt-10">
        <EmpreendimentosList />
      </div>
    </main>
  );
}