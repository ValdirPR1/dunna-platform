"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import EditorTexto from "@/features/blog/components/EditorTexto";
import {
  buscarPost,
  atualizarPost,
  uploadImagemCapa,
} from "@/features/blog/services/blog.service";

export default function EditarArtigoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemCapa, setImagemCapa] = useState<string | null>(null);
  const [publicado, setPublicado] = useState(false);

  useEffect(() => {
    buscarPost(id).then((post) => {
      if (!post) return;
      setTitulo(post.titulo);
      setResumo(post.resumo ?? "");
      setCategoria(post.categoria ?? "");
      setConteudo(post.conteudo_html ?? "");
      setImagemCapa(post.imagem_capa);
      setPublicado(post.publicado);
      setLoading(false);
    });
  }, [id]);

  async function escolherImagem(file: File | null) {
    if (!file) return;

    setEnviandoImagem(true);
    try {
      const url = await uploadImagemCapa(file);
      setImagemCapa(url);
    } catch {
      toast.error("Não foi possível enviar a imagem.");
    } finally {
      setEnviandoImagem(false);
    }
  }

  async function salvar() {
    setSalvando(true);

    try {
      await atualizarPost(id, {
        titulo,
        resumo,
        conteudo_html: conteudo,
        imagem_capa: imagemCapa ?? undefined,
        categoria,
        publicado,
      });

      toast.success("Artigo atualizado!");
      router.push("/blog");
    } catch (e) {
      console.error(e);
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

      <div className="mx-auto max-w-3xl pb-16">

        <h1 className="mb-8 font-display text-3xl font-bold text-navy">
          Editar Artigo
        </h1>

        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título do artigo"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-xl font-semibold text-navy outline-none focus:border-gold"
          />

          <div className="grid gap-4 md:grid-cols-2">

            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Categoria"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
            />

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-4 font-sans text-sm text-slate-500 hover:border-gold hover:text-gold">
              <Upload size={16} />
              {enviandoImagem ? "Enviando..." : "Trocar foto de capa"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  escolherImagem(e.target.files?.[0] ?? null)
                }
              />
            </label>

          </div>

          {imagemCapa && (
            <img
              src={imagemCapa}
              alt="Capa"
              className="h-48 w-full rounded-xl object-cover"
            />
          )}

          <textarea
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            rows={2}
            placeholder="Resumo curto"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <div>
            <label className="mb-2 block font-sans text-sm font-medium text-slate-600">
              Conteúdo do artigo
            </label>
            <EditorTexto conteudo={conteudo} onChange={setConteudo} />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={publicado}
              onChange={(e) => setPublicado(e.target.checked)}
              className="h-5 w-5 accent-gold"
            />
            <span className="font-sans text-navy">
              Publicado (visível no site)
            </span>
          </label>

          <button
            onClick={salvar}
            disabled={salvando}
            className="w-full rounded-xl bg-navy py-4 font-sans font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>

        </div>

      </div>

    </AppShell>
  );
}
