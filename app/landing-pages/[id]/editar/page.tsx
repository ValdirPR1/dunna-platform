"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ExternalLink, Plus, X } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import {
  buscarLandingPage,
  atualizarLandingPage,
  ItemDestaque,
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
    aviso_legal: "",
    ativa: true,
  });

  const [badges, setBadges] = useState<string[]>([]);
  const [novoBadge, setNovoBadge] = useState("");

  const [estatisticas, setEstatisticas] = useState<ItemDestaque[]>([]);
  const [distancias, setDistancias] = useState<ItemDestaque[]>([]);

  useEffect(() => {
    buscarLandingPage(id).then((pagina) => {
      if (!pagina) return;
      setSlug(pagina.slug);
      setForm({
        titulo: pagina.titulo,
        headline: pagina.headline ?? "",
        subheadline: pagina.subheadline ?? "",
        video_url: pagina.video_url ?? "",
        aviso_legal:
          pagina.aviso_legal ?? "Imagens meramente ilustrativas.",
        ativa: pagina.ativa,
      });
      setBadges(pagina.badges ?? []);
      setEstatisticas(pagina.estatisticas ?? []);
      setDistancias(pagina.distancias ?? []);
      setLoading(false);
    });
  }, [id]);

  function atualizar(campo: string, valor: string | boolean) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function adicionarBadge() {
    const valor = novoBadge.trim();
    if (!valor) return;
    setBadges((prev) => [...prev, valor]);
    setNovoBadge("");
  }

  function removerBadge(index: number) {
    setBadges((prev) => prev.filter((_, i) => i !== index));
  }

  function adicionarItem(
    lista: ItemDestaque[],
    setLista: (v: ItemDestaque[]) => void
  ) {
    setLista([...lista, { valor: "", label: "" }]);
  }

  function atualizarItem(
    lista: ItemDestaque[],
    setLista: (v: ItemDestaque[]) => void,
    index: number,
    campo: "valor" | "label",
    valor: string
  ) {
    const copia = [...lista];
    copia[index] = { ...copia[index], [campo]: valor };
    setLista(copia);
  }

  function removerItem(
    lista: ItemDestaque[],
    setLista: (v: ItemDestaque[]) => void,
    index: number
  ) {
    setLista(lista.filter((_, i) => i !== index));
  }

  async function salvar() {
    setSalvando(true);

    try {
      await atualizarLandingPage(id, {
        ...form,
        badges,
        estatisticas,
        distancias,
      });
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

      <div className="mx-auto max-w-2xl pb-16">

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

        {/* Dados básicos */}

        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="font-display text-lg font-bold text-navy">
            Dados básicos
          </h2>

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

        </div>

        {/* Badges */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="font-display text-lg font-bold text-navy">
            Badges rápidos
          </h2>
          <p className="mt-1 mb-4 font-sans text-sm text-slate-500">
            Aparecem logo abaixo da chamada principal (ex: "Beira-mar",
            "Lazer completo").
          </p>

          <div className="flex flex-wrap gap-2">
            {badges.map((badge, i) => (
              <span
                key={i}
                className="flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 font-sans text-sm text-navy"
              >
                {badge}
                <button onClick={() => removerBadge(i)}>
                  <X size={13} className="text-slate-400 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={novoBadge}
              onChange={(e) => setNovoBadge(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarBadge();
                }
              }}
              placeholder="Digite e adicione"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-navy outline-none focus:border-gold"
            />
            <button
              onClick={adicionarBadge}
              className="flex items-center gap-1 rounded-xl bg-navy px-4 py-3 font-sans text-sm font-semibold text-white"
            >
              <Plus size={15} />
              Adicionar
            </button>
          </div>

        </div>

        {/* Números de destaque */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="font-display text-lg font-bold text-navy">
            Números de destaque
          </h2>
          <p className="mt-1 mb-4 font-sans text-sm text-slate-500">
            Ex: "12" + "Hectares", "+50" + "Itens de lazer".
          </p>

          {estatisticas.map((item, i) => (
            <div key={i} className="mb-3 flex gap-2">
              <input
                value={item.valor}
                onChange={(e) =>
                  atualizarItem(estatisticas, setEstatisticas, i, "valor", e.target.value)
                }
                placeholder="Valor (ex: 12)"
                className="w-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-navy outline-none focus:border-gold"
              />
              <input
                value={item.label}
                onChange={(e) =>
                  atualizarItem(estatisticas, setEstatisticas, i, "label", e.target.value)
                }
                placeholder="Legenda (ex: Hectares)"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-navy outline-none focus:border-gold"
              />
              <button
                onClick={() => removerItem(estatisticas, setEstatisticas, i)}
                className="rounded-xl px-3 text-red-500 hover:bg-red-50"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={() => adicionarItem(estatisticas, setEstatisticas)}
            className="mt-1 flex items-center gap-1 font-sans text-sm font-semibold text-gold"
          >
            <Plus size={15} />
            Adicionar número
          </button>

        </div>

        {/* Distâncias */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="font-display text-lg font-bold text-navy">
            Distâncias (seção de localização)
          </h2>
          <p className="mt-1 mb-4 font-sans text-sm text-slate-500">
            Ex: "90km" + "Aeroporto do Recife", "12km" + "Porto de Galinhas".
          </p>

          {distancias.map((item, i) => (
            <div key={i} className="mb-3 flex gap-2">
              <input
                value={item.valor}
                onChange={(e) =>
                  atualizarItem(distancias, setDistancias, i, "valor", e.target.value)
                }
                placeholder="Valor (ex: 90km)"
                className="w-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-navy outline-none focus:border-gold"
              />
              <input
                value={item.label}
                onChange={(e) =>
                  atualizarItem(distancias, setDistancias, i, "label", e.target.value)
                }
                placeholder="Legenda (ex: Aeroporto do Recife)"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-navy outline-none focus:border-gold"
              />
              <button
                onClick={() => removerItem(distancias, setDistancias, i)}
                className="rounded-xl px-3 text-red-500 hover:bg-red-50"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={() => adicionarItem(distancias, setDistancias)}
            className="mt-1 flex items-center gap-1 font-sans text-sm font-semibold text-gold"
          >
            <Plus size={15} />
            Adicionar distância
          </button>

        </div>

        {/* Aviso legal + ativa */}

        <div className="mt-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <div>
            <label className="mb-2 block font-sans text-sm font-medium text-slate-600">
              Aviso legal (aparece no rodapé)
            </label>
            <input
              value={form.aviso_legal}
              onChange={(e) => atualizar("aviso_legal", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
            />
          </div>

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

        </div>

        <button
          onClick={salvar}
          disabled={salvando}
          className="mt-6 w-full rounded-xl bg-navy py-4 font-sans font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>

      </div>

    </AppShell>
  );
}
