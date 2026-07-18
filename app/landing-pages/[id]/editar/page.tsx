"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import {
  buscarLandingPage,
  atualizarLandingPage,
} from "@/features/landingpages/services/landingpages.service";

export default function EditarLandingPagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [slug, setSlug] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    headline: "",
    subheadline: "",
    video_url: "",
    ativa: true,
  });

  useEffect(() => {
    buscarLandingPage(id).then((pagina) => {
      if (!pagina) return;
      setSlug(pagina.slug);
      setForm({
        titulo: pagina.titulo,
        headline: pagina.headline ?? "",
        subheadline: pagina.subheadline ?? "",
        video_url: pagina.video_url ?? "",
        ativa: pagina.ativa,
      });
      setLoading(false);
    });
  }, [id]);

  function atualizar(campo: string, valor: string | boolean) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvar() {
    setSalvando(true);

    try {
      await atualizarLandingPage(id, form);
      toast.success("Landing page atualizada!");
      router.push("/landing-pages");
    } catch {
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <AppShell somenteMaster>
        <p className="font-sans text-slate-400">Carregando...</p>
      </AppShell>
    );
  }

  return (
    <AppShell somenteMaster>

      <div className="mx-auto max-w-2xl">

        <div className="mb-8 flex items-center justify-between">

          <h1 className="font-display text-3xl font-bold text-navy">
            Editar Landing Page
          </h1>

          <Link
            href={`/lp/${slug}`}
            target="_blank"
            className="flex items-center gap-2 font-sans text-sm font-semibold text-gold hover:underline"
          >
            <ExternalLink size={15} />
            Ver página
          </Link>

        </div>

        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <input
            value={form.titulo}
            onChange={(e) => atualizar("titulo", e.target.value)}
            placeholder="Nome interno"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={form.headline}
            onChange={(e) => atualizar("headline", e.target.value)}
            placeholder="Chamada principal"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={form.subheadline}
            onChange={(e) => atualizar("subheadline", e.target.value)}
            placeholder="Subtítulo"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={form.video_url}
            onChange={(e) => atualizar("video_url", e.target.value)}
            placeholder="Link do vídeo (YouTube ou MP4)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={form.ativa}
              onChange={(e) => atualizar("ativa", e.target.checked)}
              className="h-5 w-5 accent-gold"
            />
            <span className="font-sans text-navy">
              Landing page ativa (acessível publicamente)
            </span>
          </label>

          <button
            onClick={salvar}
            disabled={salvando}
            className="w-full rounded-xl bg-navy py-4 font-sans font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>

        </div>

      </div>

    </AppShell>
  );
}
