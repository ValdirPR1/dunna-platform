"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import AgendarVisitaModal from "./AgendarVisitaModal";
import { useIdioma } from "@/features/idioma/IdiomaContext";

interface Props {
  imovelTitulo: string;
  corretorId?: string | null;
}

export default function BotaoAgendarVisita({
  imovelTitulo,
  corretorId,
}: Props) {
  const { t } = useIdioma();
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gold py-4 font-sans text-lg font-semibold text-gold transition hover:bg-gold/5"
      >
        <CalendarCheck size={20} />
        {t.agendarVisita.botao}
      </button>

      <AgendarVisitaModal
        imovelTitulo={imovelTitulo}
        corretorId={corretorId}
        aberto={aberto}
        onFechar={() => setAberto(false)}
      />
    </>
  );
}
