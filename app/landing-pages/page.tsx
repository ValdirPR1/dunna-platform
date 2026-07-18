"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, ExternalLink, Trash2, BarChart3 } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import {
  listarLandingPages,
  excluirLandingPage,
  LandingPage,
} from "@/features/landingpages/services/landingpages.service";
import NovaLandingPageModal from "@/features/landingpages/components/NovaLandingPageModal";

export default function LandingPagesPage() {
  const [paginas, setPaginas] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    const dados = await listarLandingPages();
    setPaginas(dados);
    setLoading(false);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta landing page? Essa ação não pode ser desfeita."))
      return;

    try {
      await excluirLandingPage(id);
      toast.success("Landing page excluída.");
      carregar();
    } catch {
      toast.error("Não foi possível excluir.");
    }
  }

  return (
    <AppShell somenteMaster>

      <div className="mb-10 flex items-center justify-between">

        <div>
          <h1 className="font-display text-3xl font-bold text-navy">
            Landing Pages
          </h1>
          <p className="mt-2 font-sans text-slate-500">
            Páginas de venda focadas, ideais pra usar em campanhas
            de anúncios.
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          <Plus size={18} />
          Nova Landing Page
        </button>

      </div>

      {loading ? (

        <p className="font-sans text-slate-400">Carregando...</p>

      ) : paginas.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Nenhuma landing page criada ainda.
          </p>
        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {paginas.map((pagina) => (

            <div
              key={pagina.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <div className="flex items-start justify-between">

                <h2 className="font-display text-lg font-semibold text-navy">
                  {pagina.titulo}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${
                    pagina.ativa
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {pagina.ativa ? "Ativa" : "Inativa"}
                </span>

              </div>

              <p className="mt-2 font-sans text-sm text-slate-400">
                /lp/{pagina.slug}
              </p>

              <div className="mt-4 flex items-center gap-2 font-sans text-sm text-slate-500">
                <BarChart3 size={15} />
                {pagina.visitas} visita(s)
              </div>

              <div className="mt-5 flex gap-2">

                <Link
                  href={`/lp/${pagina.slug}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 font-sans text-sm font-semibold text-navy hover:bg-slate-50"
                >
                  <ExternalLink size={15} />
                  Ver página
                </Link>

                <Link
                  href={`/landing-pages/${pagina.id}/editar`}
                  className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 py-2.5 font-sans text-sm font-semibold text-navy hover:bg-slate-50"
                >
                  Editar
                </Link>

                <button
                  onClick={() => excluir(pagina.id)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 px-3 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      <NovaLandingPageModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onCriada={carregar}
      />

    </AppShell>
  );
}
