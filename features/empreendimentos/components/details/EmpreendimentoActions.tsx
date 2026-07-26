"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { excluirEmpreendimento } from "../../services/empreendimentos.service";

interface Props {
  id: string;
  nome: string;
}

export default function EmpreendimentoActions({ id, nome }: Props) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);

  async function handleExcluir() {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir "${nome}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    setExcluindo(true);

    try {
      const { error } = await excluirEmpreendimento(id);

      if (error) throw error;

      toast.success("Empreendimento excluído.");
      router.push("/empreendimentos");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir o empreendimento.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="contents">

      <Link
        href={`/empreendimentos/${id}/editar`}
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 font-sans text-sm font-semibold text-navy transition hover:bg-slate-50 sm:py-3 sm:text-base"
      >
        <Pencil size={16} />
        Editar
      </Link>

      <button
        onClick={handleExcluir}
        disabled={excluindo}
        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 font-sans text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 sm:py-3 sm:text-base"
      >
        <Trash2 size={16} />
        {excluindo ? "Excluindo..." : "Excluir"}
      </button>

    </div>
  );
}
