"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RotateCcw, Trash2, MessageCircle } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import {
  listarLeadsPerdidos,
  reativarLead,
  excluirDefinitivamente,
} from "@/features/crm/services/oportunidades.service";
import { Oportunidade } from "@/features/crm/types/oportunidade";

export default function LeadsPerdidosPage() {
  const [leads, setLeads] = useState<Oportunidade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    setLeads(await listarLeadsPerdidos());
    setLoading(false);
  }

  async function reativar(id: string) {
    try {
      await reativarLead(id);
      toast.success("Lead reativado! Ele voltou pro Kanban em \"Novo Lead\".");
      carregar();
    } catch {
      toast.error("Não foi possível reativar.");
    }
  }

  async function excluir(id: string) {
    if (
      !confirm(
        "Excluir esse lead DEFINITIVAMENTE? Essa ação não pode ser desfeita — os dados serão apagados de vez."
      )
    )
      return;

    try {
      await excluirDefinitivamente(id);
      toast.success("Lead excluído definitivamente.");
      carregar();
    } catch {
      toast.error("Não foi possível excluir.");
    }
  }

  return (
    <AppShell somenteMaster>

      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-navy">
          Leads Perdidos
        </h1>
        <p className="mt-2 font-sans text-slate-500">
          Leads removidos do Kanban, guardados aqui pra possível
          remarketing (ex: novo lançamento, promoção). Nada aqui é
          apagado até você excluir definitivamente.
        </p>
      </div>

      {loading ? (

        <p className="font-sans text-slate-400">Carregando...</p>

      ) : leads.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Nenhum lead perdido no momento.
          </p>
        </div>

      ) : (

        <div className="space-y-3">

          {leads.map((lead) => (

            <div
              key={lead.id}
              className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >

              <div>

                <h2 className="font-display font-semibold text-navy">
                  {lead.pessoa?.nome ?? lead.titulo ?? "Sem nome"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-3 font-sans text-sm text-slate-500">

                  {lead.pessoa?.telefone && (
                    <span className="flex items-center gap-1">
                      <MessageCircle size={13} />
                      {lead.pessoa.telefone}
                    </span>
                  )}

                  {lead.perdido_em && (
                    <span className="text-slate-400">
                      Perdido em{" "}
                      {new Date(lead.perdido_em).toLocaleDateString("pt-BR")}
                    </span>
                  )}

                </div>

              </div>

              <div className="flex shrink-0 gap-2">

                <button
                  onClick={() => reativar(lead.id)}
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 font-sans text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <RotateCcw size={15} />
                  Reativar
                </button>

                <button
                  onClick={() => excluir(lead.id)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 font-sans text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Excluir definitivamente
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </AppShell>
  );
}
