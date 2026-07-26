"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Link2,
  MessageCircle,
  Mail,
  Pencil,
  Trash2,
} from "lucide-react";
import BotaoBaixarFotos from "@/components/shared/BotaoBaixarFotos";
import { excluirEmpreendimento } from "../../services/empreendimentos.service";

interface Props {
  id: string;
  nome: string;
  slug?: string | null;
  fotos: string[];
}

// Junta TODOS os botões de ação do empreendimento (compartilhar, baixar
// fotos, editar, excluir) sem nenhum agrupamento/wrapper interno — isso
// é o que garante que a grade de 2 colunas funcione de verdade no
// celular, inclusive no Safari do iPhone (que tem bugs conhecidos com
// a técnica de "display: contents" usada antes)
export default function AcoesCompletasEmpreendimento({
  id,
  nome,
  slug,
  fotos,
}: Props) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);

  const url =
    typeof window !== "undefined" && slug
      ? `${window.location.origin}/site/empreendimentos/${slug}`
      : "";

  function handleCopiarLink() {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  function handleWhatsApp() {
    const texto = encodeURIComponent(`Olha isso: ${nome}\n${url}`);
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  }

  function handleEmail() {
    const assunto = encodeURIComponent(nome);
    const corpo = encodeURIComponent(`Olá! Segue o link:\n\n${url}`);
    window.open(`mailto:?subject=${assunto}&body=${corpo}`);
  }

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

  const classeBotao =
    "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-sans text-sm font-semibold transition sm:py-2 sm:text-base";

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">

      {slug && (
        <>
          <button
            onClick={handleCopiarLink}
            className={`${classeBotao} border-slate-200 text-navy hover:bg-slate-50`}
          >
            <Link2 size={16} />
            Copiar link
          </button>

          <button
            onClick={handleWhatsApp}
            className={`${classeBotao} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>

          <button
            onClick={handleEmail}
            className={`${classeBotao} border-slate-200 text-navy hover:bg-slate-50`}
          >
            <Mail size={16} />
            E-mail
          </button>
        </>
      )}

      <BotaoBaixarFotos
        fotos={fotos}
        nomeArquivo={nome}
        className={`${classeBotao} border-slate-200 text-navy hover:bg-slate-50 disabled:opacity-60`}
      />

      <Link
        href={`/empreendimentos/${id}/editar`}
        className={`${classeBotao} border-slate-200 text-navy hover:bg-slate-50`}
      >
        <Pencil size={16} />
        Editar
      </Link>

      <button
        onClick={handleExcluir}
        disabled={excluindo}
        className={`${classeBotao} border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60`}
      >
        <Trash2 size={16} />
        {excluindo ? "Excluindo..." : "Excluir"}
      </button>

    </div>
  );
}
