"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EstoqueUnidades from "@/features/unidades/components/EstoqueUnidades";

import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  buscarEmpreendimento,
} from "../services/empreendimentos.service";

import Hero from "../components/details/Hero";
import PublishPanel from "../components/details/PublishPanel";
import Overview from "../components/details/Overview";
import Gallery from "../components/details/Gallery";
import Units from "../components/details/Units";
import Documents from "../components/details/Documents";
import Location from "../components/details/Location";
import Timeline from "../components/details/Timeline";
import Tabs from "../components/details/Tabs";

export default function EmpreendimentoDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [empreendimento, setEmpreendimento] = useState<any>(null);
  const [aba, setAba] = useState("Visão Geral");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await buscarEmpreendimento(
        params.id as string
      );

      setEmpreendimento(dados);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!empreendimento) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Empreendimento não encontrado.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-8">

      <div className="flex items-center justify-between">

        <div>

          <button
            onClick={() => router.push("/empreendimentos")}
            className="mb-4 flex items-center gap-2 text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <h1 className="text-4xl font-bold text-white">
            {empreendimento.nome}
          </h1>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() =>
              router.push(`/empreendimentos/${empreendimento.id}/editar`)
            }
            className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-white hover:bg-zinc-800"
          >
            <Pencil size={18} />
            Editar
          </button>

          <button
            onClick={() =>
              router.push(`/unidades?empreendimento=${empreendimento.id}`)
            }
            className="flex items-center gap-2 rounded-xl bg-[#C8A96A] px-5 py-3 font-semibold text-black hover:brightness-110"
          >
            <Plus size={18} />
            Nova Unidade
          </button>

          <button
            className="flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 size={18} />
            Excluir
          </button>

        </div>

      </div>

    <Hero empreendimento={empreendimento} />

<PublishPanel
  empreendimento={empreendimento}
/>

<Tabs
  aba={aba}
  setAba={setAba}
/>

{aba === "Visão Geral" && (
  <Overview empreendimento={empreendimento} />
)}

{aba === "Galeria" && (
  <Gallery empreendimentoId={empreendimento.id} />
)}

{aba === "Unidades" && (
 <EstoqueUnidades
  empreendimentoId={empreendimento.id}
/>
)}

{aba === "Documentos" && (
  <Documents />
)}

{aba === "Mapa" && (
  <Location />
)}

      {aba === "Histórico" && (
        <Timeline />
      )}

    </main>
  );
}