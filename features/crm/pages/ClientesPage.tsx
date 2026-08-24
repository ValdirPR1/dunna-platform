"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Archive, Plus } from "lucide-react";
import {
  Cliente,
  listarClientes,
  removerCliente,
} from "../services/clientes.service";
import NovoClienteModal from "../components/NovoClienteModal";
import { useAuth } from "@/features/core/auth/useAuth";

export default function ClientesPage() {
  const { usuario } = useAuth();
  const souMaster = usuario?.papel === "master";
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [removendoId, setRemovendoId] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const dados = await listarClientes();
      setClientes(dados);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleRemover(id: string, nome: string) {
    const confirmado = window.confirm(
      `Remover "${nome}" da lista de clientes? Ele sai daqui, mas o cadastro e o histórico ficam guardados — dá pra reativar depois em Clientes Removidos.`
    );

    if (!confirmado) return;

    setRemovendoId(id);

    try {
      await removerCliente(id);
      toast.success("Cliente removido da lista.");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Não foi possível remover o cliente."
      );
    } finally {
      setRemovendoId(null);
    }
  }

  return (
    <div>

      <div className="flex items-start justify-between">

        <div>

          <h1 className="font-display text-3xl font-bold text-navy">
            Clientes
          </h1>

          <p className="mt-2 font-sans text-slate-500">
            Pessoas que já fecharam negócio com a Dunna.
          </p>

        </div>

        <div className="flex items-center gap-4">

          {souMaster && (
            <Link
              href="/crm/clientes-removidos"
              className="font-sans text-sm text-slate-500 hover:text-gold"
            >
              Clientes removidos
            </Link>
          )}

          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
          >
            <Plus size={18} />
            Novo Cliente
          </button>

        </div>

      </div>

      <div className="mt-8">

        {loading ? (

          <p className="font-sans text-slate-400">Carregando...</p>

        ) : clientes.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <p className="font-sans text-slate-500">
              Nenhum cliente ainda. Quando um lead fecha negócio no
              Kanban (etapa "Contrato" ou "Pós-venda"), ele vira
              cliente automaticamente.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">

            <table className="w-full min-w-[700px]">

              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Nome</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Telefone</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">E-mail</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Cidade</th>
                  {souMaster && <th className="px-5 py-4"></th>}
                </tr>
              </thead>

              <tbody>

                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <Link
                        href={`/crm/clientes/${cliente.id}`}
                        className="font-sans font-semibold text-navy hover:text-gold"
                      >
                        {cliente.nome}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-sans text-slate-500">
                      {cliente.telefone ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-sans text-slate-500">
                      {cliente.email ?? "—"}
                    </td>
                    <td className="px-5 py-4 font-sans text-slate-500">
                      {cliente.cidade ?? "—"}
                    </td>
                    {souMaster && (
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleRemover(cliente.id, cliente.nome)}
                          disabled={removendoId === cliente.id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                          title="Remover da lista (não apaga o cadastro)"
                        >
                          <Archive size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <NovoClienteModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSaved={carregar}
      />

    </div>
  );
}
