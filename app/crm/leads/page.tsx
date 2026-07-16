"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { useOportunidades } from "@/features/crm/hooks/useOportunidades";
import Kanban from "@/features/crm/components/Kanban";
import LeadModal from "@/features/crm/components/LeadModal";
import { excluirOportunidade } from "@/features/crm/services/oportunidades.service";
import { Oportunidade } from "@/features/crm/types/oportunidade";

export default function CRMPage() {
  const { oportunidades, loading, moverParaEtapa, atualizar } =
    useOportunidades();

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Oportunidade | null>(null);

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(oportunidade: Oportunidade) {
    setEditando(oportunidade);
    setModalAberto(true);
  }

  async function handleExcluir(oportunidade: Oportunidade) {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir "${oportunidade.titulo}"?`
    );

    if (!confirmado) return;

    try {
      await excluirOportunidade(oportunidade.id);
      toast.success("Lead excluído.");
      atualizar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir o lead.");
    }
  }

  return (
    <AppShell>
      <div className="p-8">

        <div className="flex items-start justify-between">

          <div>

            <h1 className="font-display text-3xl font-bold text-navy">
              CRM
            </h1>

            <p className="mt-2 font-sans text-slate-500">
              Acompanhe as oportunidades do funil de vendas. Arraste os
              cards entre as colunas para mudar a etapa.
            </p>

          </div>

          <button
            onClick={abrirNovo}
            className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
          >
            <Plus size={18} />
            Novo Lead
          </button>

        </div>

        <div className="mt-8">
          {loading ? (
            <p className="font-sans text-slate-400">Carregando oportunidades...</p>
          ) : (
            <Kanban
              oportunidades={oportunidades}
              onMover={moverParaEtapa}
              onEditar={abrirEdicao}
              onExcluir={handleExcluir}
            />
          )}
        </div>

        <LeadModal
          open={modalAberto}
          onClose={() => setModalAberto(false)}
          onSaved={atualizar}
          oportunidadeEditando={editando}
        />

      </div>
    </AppShell>
  );
}
