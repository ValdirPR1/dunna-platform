"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  buscarCliente,
  listarHistoricoCliente,
} from "../services/clientes.service";

interface Props {
  id: string;
}

function formatarPreco(valor: number | null) {
  if (!valor) return "—";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function ClienteDetalhesPage({ id }: Props) {
  const [cliente, setCliente] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([buscarCliente(id), listarHistoricoCliente(id)])
      .then(([c, h]) => {
        setCliente(c);
        setHistorico(h);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="font-sans text-slate-400">Carregando...</p>;
  }

  if (!cliente) {
    return <p className="font-sans text-slate-500">Cliente não encontrado.</p>;
  }

  return (
    <div>

      <Link
        href="/crm/clientes"
        className="font-sans text-sm text-slate-500 hover:text-gold"
      >
        ← Voltar para Clientes
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold text-navy">
        {cliente.nome}
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="font-display text-xl font-bold text-navy">
            Dados de contato
          </h2>

          <div className="mt-5 space-y-3 font-sans text-slate-600">
            <p>Telefone: {cliente.telefone ?? "—"}</p>
            <p>WhatsApp: {cliente.whatsapp ?? "—"}</p>
            <p>E-mail: {cliente.email ?? "—"}</p>
            <p>Cidade: {cliente.cidade ?? "—"}</p>
            {cliente.endereco && <p>Endereço: {cliente.endereco}</p>}
          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="font-display text-xl font-bold text-navy">
            Histórico de negociações
          </h2>

          {historico.length === 0 ? (

            <p className="mt-5 font-sans text-slate-400">
              Nenhuma negociação registrada ainda.
            </p>

          ) : (

            <div className="mt-5 space-y-3">

              {historico.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <p className="font-sans font-semibold text-navy">
                    {item.titulo}
                  </p>
                  <p className="mt-1 font-sans text-sm text-slate-500">
                    {item.etapa} •{" "}
                    {formatarPreco(item.valor_previsto ?? item.valor_interesse)}
                  </p>
                </div>
              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
