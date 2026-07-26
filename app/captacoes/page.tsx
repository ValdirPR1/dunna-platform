"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Trash2, Home } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import {
  listarCaptacoes,
  excluirCaptacao,
  Captacao,
} from "@/features/captacoes/services/captacoes.service";

function corDoStatus(status: string) {
  switch (status) {
    case "Aprovado":
      return "bg-emerald-50 text-emerald-600";
    case "Recusado":
      return "bg-red-50 text-red-500";
    case "Convertido em anúncio":
      return "bg-gold/10 text-gold";
    case "Aguardando decisão do proprietário":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

export default function CaptacoesPage() {
  const [captacoes, setCaptacoes] = useState<Captacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    setCaptacoes(await listarCaptacoes());
    setLoading(false);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta captação?")) return;

    try {
      await excluirCaptacao(id);
      toast.success("Captação excluída.");
      carregar();
    } catch {
      toast.error("Não foi possível excluir.");
    }
  }

  return (
    <AppShell>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="font-display text-2xl font-bold text-navy md:text-3xl">
            Captação de Imóveis
          </h1>
          <p className="mt-2 font-sans text-slate-500">
            Fichas de vistoria de imóveis avaliados pra possível anúncio.
          </p>
        </div>

        <Link
          href="/captacoes/nova"
          className="flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          <Plus size={18} />
          Nova Captação
        </Link>

      </div>

      {loading ? (

        <p className="font-sans text-slate-400">Carregando...</p>

      ) : captacoes.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Nenhuma captação registrada ainda.
          </p>
        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {captacoes.map((c) => (

            <Link
              key={c.id}
              href={`/captacoes/${c.id}/editar`}
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >

              <div className="flex items-start justify-between">
                <h2 className="font-display text-lg font-semibold text-navy">
                  {c.titulo || "Sem título"}
                </h2>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    excluir(c.id);
                  }}
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <p className="mt-1 font-sans text-slate-500">
                {c.bairro ? `${c.bairro}, ` : ""}
                {c.cidade}
              </p>

              <p className="mt-2 font-sans text-sm text-slate-400">
                Proprietário: {c.proprietario_nome || "—"}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${corDoStatus(
                    c.status
                  )}`}
                >
                  {c.status}
                </span>

                {c.imovel_id && (
                  <Link
                    href={`/imoveis/${c.imovel_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 font-sans text-xs font-semibold text-gold hover:underline"
                  >
                    <Home size={12} />
                    Ver anúncio
                  </Link>
                )}
              </div>

            </Link>

          ))}

        </div>

      )}

    </AppShell>
  );
}
