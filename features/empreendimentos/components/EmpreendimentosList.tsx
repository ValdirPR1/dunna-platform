"use client";

import EmpreendimentoCard from "./EmpreendimentoCard";
import { useEmpreendimentos } from "../hooks/useEmpreendimentos";

export default function EmpreendimentosList() {

  const {
    empreendimentos,
    loading,
    remover,
  } = useEmpreendimentos();

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        Carregando empreendimentos...
      </div>
    );
  }

  if (empreendimentos.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500">
        Nenhum empreendimento cadastrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">

      {empreendimentos.map((empreendimento) => (

        <EmpreendimentoCard
          key={empreendimento.id}
          empreendimento={empreendimento}
          onDelete={remover}
        />

      ))}

    </div>
  );
}