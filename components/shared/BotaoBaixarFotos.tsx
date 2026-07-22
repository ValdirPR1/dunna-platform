"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import { baixarFotosComoZip } from "@/lib/baixarFotosZip";

interface Props {
  fotos: string[];
  nomeArquivo: string;
  className?: string;
}

export default function BotaoBaixarFotos({
  fotos,
  nomeArquivo,
  className,
}: Props) {
  const [baixando, setBaixando] = useState(false);

  if (fotos.length === 0) return null;

  async function baixar() {
    setBaixando(true);

    try {
      await baixarFotosComoZip(fotos, nomeArquivo);
      toast.success("Fotos baixadas!");
    } catch (error: any) {
      toast.error(error?.message ?? "Não foi possível baixar as fotos.");
    } finally {
      setBaixando(false);
    }
  }

  return (
    <button
      onClick={baixar}
      disabled={baixando}
      className={
        className ??
        "flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-sans text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:opacity-60"
      }
    >
      <Download size={16} />
      {baixando ? "Baixando..." : `Baixar Fotos (${fotos.length})`}
    </button>
  );
}
