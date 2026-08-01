"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import { useOportunidades } from "@/features/crm/hooks/useOportunidades";
import Kanban from "@/features/crm/components/Kanban";
import LeadModal from "@/features/crm/components/LeadModal";
import HistoricoLeadModal from "@/features/crm/components/HistoricoLeadModal";
import {
  atualizarEtapaOportunidade,
  excluirOportunidade,
} from "@/features/crm/services/oportunidades.service";
import { Oportunidade } from "@/features/crm/types/oportunidade";

// O Next exige que quem usa useSearchParams() esteja dentro de um
// Suspense boundary pra poder gerar a página — por isso o conteúdo de
// verdade fica num componente separado, envolvido aqui embaixo.
export default function CRMPage() {
  return (
    <Suspense fallback={null}>
      <CRMPageConteudo />
    </Suspense>
  );
}

function CRMPageConteudo() {
  const { oportunidades, loading, moverParaEtapa, atualizar } =
    useOportunidades();

  const searchParams = useSearchParams();

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Oportunidade | null>(null);

  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [verHistoricoDe, setVerHistoricoDe] = useState<Oportunidade | null>(null);

  function abrirHistorico(oportunidade: Oportunidade) {
    setVerHistoricoDe(oportunidade);
    setHistoricoAberto(true);
  }

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  // Permite abrir o modal de novo lead direto por um atalho externo,
  // como o botão "Novo" no topo do sistema (/crm/leads?novo=1)
  useEffect(() => {
    if (searchParams.get("novo") === "1") {
      abrirNovo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function abrirEdicao(oportunidade: Oportunidade) {
    setEditando(oportunidade);
    setModalAberto(true);
  }

  async function handleExcluir(oportunidade: Oportunidade) {
    const confirmado = window.confirm(
      `Mover "${oportunidade.titulo}" pra Leads Perdidos? Ele sai do Kanban, mas fica guardado (dá pra reativar depois, em Leads Perdidos).`
    );

    if (!confirmado) return;

    try {
      await excluirOportunidade(oportunidade.id);
      toast.success("Lead movido pra Leads Perdidos.");
      atualizar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível mover o lead.");
    }
  }

  // Quando o contrato é assinado: a venda vira oficial e o lead segue
  // pro Pós-venda (é isso que conta como VGV vendido no Financeiro).
  async function handleVendaRealizada(oportunidade: Oportunidade) {
    try {
      await atualizarEtapaOportunidade(oportunidade.id, "Pós-venda");
      toast.success("Venda registrada! Lead movido para Pós-venda.");
      atualizar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível registrar a venda.");
    }
  }

  // Contrato não assinado, cliente desistiu ou sumiu antes de
  // assinar: mesma lógica de "Leads Perdidos" já usada no botão de
  // excluir (marca perdido, mas guarda o histórico pra remarketing).
  async function handleVendaPerdida(oportunidade: Oportunidade) {
    const confirmado = window.confirm(
      `Marcar "${oportunidade.titulo}" como venda perdida? Ele sai do Kanban e vai para Leads Perdidos (dá pra reativar depois).`
    );

    if (!confirmado) return;

    try {
      await excluirOportunidade(oportunidade.id);
      toast.success("Venda perdida registrada.");
      atualizar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível registrar.");
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
              onVerHistorico={abrirHistorico}
              onVendaRealizada={handleVendaRealizada}
              onVendaPerdida={handleVendaPerdida}
            />
          )}
        </div>

        <LeadModal
          open={modalAberto}
          onClose={() => setModalAberto(false)}
          onSaved={atualizar}
          oportunidadeEditando={editando}
        />

        <HistoricoLeadModal
          open={historicoAberto}
          onClose={() => setHistoricoAberto(false)}
          oportunidade={verHistoricoDe}
        />

      </div>
    </AppShell>
  );
}
