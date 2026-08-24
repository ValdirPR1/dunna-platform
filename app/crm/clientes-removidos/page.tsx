"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RotateCcw, Trash2, Mail, Phone } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import {
  Cliente,
  listarClientesRemovidos,
  reativarCliente,
  excluirCliente,
} from "@/features/crm/services/clientes.service";

export default function ClientesRemovidosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    setClientes(await listarClientesRemovidos());
    setLoading(false);
  }

  async function reativar(id: string) {
    try {
      await reativarCliente(id);
      toast.success("Cliente reativado! Ele voltou pra lista de Clientes.");
      carregar();
    } catch {
      toast.error("Não foi possível reativar.");
    }
  }

  async function excluir(id: string, nome: string) {
    if (
      !confirm(
        `Excluir "${nome}" DEFINITIVAMENTE? Essa ação não pode ser desfeita — os dados serão apagados de vez. Clientes com negociações no histórico não podem ser excluídos.`
      )
    )
      return;

    try {
      await excluirCliente(id);
      toast.success("Cliente excluído definitivamente.");
      carregar();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível excluir."
      );
    }
  }

  return (
    <AppShell somenteMaster>

      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-navy">
          Clientes Removidos
        </h1>
        <p className="mt-2 font-sans text-slate-500">
          Clientes tirados da lista principal, guardados aqui com o
          cadastro e o histórico intactos. Nada aqui é apagado até você
          excluir definitivamente.
        </p>
      </div>

      {loading ? (

        <p className="font-sans text-slate-400">Carregando...</p>

      ) : clientes.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Nenhum cliente removido no momento.
          </p>
        </div>

      ) : (

        <div className="space-y-3">

          {clientes.map((cliente) => (

            <div
              key={cliente.id}
              className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >

              <div>

                <h2 className="font-display font-semibold text-navy">
                  {cliente.nome}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-3 font-sans text-sm text-slate-500">

                  {cliente.telefone && (
                    <span className="flex items-center gap-1">
                      <Phone size={13} />
                      {cliente.telefone}
                    </span>
                  )}

                  {cliente.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={13} />
                      {cliente.email}
                    </span>
                  )}

                </div>

              </div>

              <div className="flex shrink-0 gap-2">

                <button
                  onClick={() => reativar(cliente.id)}
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 font-sans text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <RotateCcw size={15} />
                  Reativar
                </button>

                <button
                  onClick={() => excluir(cliente.id, cliente.nome)}
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
