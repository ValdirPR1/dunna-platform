"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Cliente, listarClientes } from "../services/clientes.service";
import NovoClienteModal from "../components/NovoClienteModal";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

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

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          <Plus size={18} />
          Novo Cliente
        </button>

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

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Nome</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Telefone</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">E-mail</th>
                  <th className="px-5 py-4 text-left font-sans text-slate-500">Cidade</th>
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
