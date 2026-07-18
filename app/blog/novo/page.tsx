"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import EditorTexto from "@/features/blog/components/EditorTexto";
import {
  criarPost,
  uploadImagemCapa,
} from "@/features/blog/services/blog.service";

export default function NovoArtigoPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemCapa, setImagemCapa] = useState<string | null>(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);

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

  async function salvar(publicarAgora: boolean) {
    if (!titulo) {
      toast.error("Dá um título pro artigo.");
      return;
    }

    setSalvando(true);

    try {
      const post = await criarPost({
        titulo,
        resumo,
        conteudo_html: conteudo,
        imagem_capa: imagemCapa ?? undefined,
        categoria,
      });

      if (publicarAgora) {
        const { atualizarPost } = await import(
          "@/features/blog/services/blog.service"
        );
        await atualizarPost(post.id, { publicado: true });
      }

      toast.success(
        publicarAgora ? "Artigo publicado!" : "Rascunho salvo!"
      );
      router.push("/blog");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AppShell somenteMaster>

      <div className="mx-auto max-w-3xl pb-16">

        <h1 className="mb-8 font-display text-3xl font-bold text-navy">
          Novo Artigo
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
              placeholder="Categoria (ex: Mercado, Investimento)"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
            />

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-4 font-sans text-sm text-slate-500 hover:border-gold hover:text-gold">
              <Upload size={16} />
              {enviandoImagem
                ? "Enviando..."
                : imagemCapa
                ? "Imagem de capa escolhida"
                : "Foto de capa"}
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
            placeholder="Resumo curto (aparece na listagem do blog)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <div>
            <label className="mb-2 block font-sans text-sm font-medium text-slate-600">
              Conteúdo do artigo
            </label>
            <EditorTexto conteudo={conteudo} onChange={setConteudo} />
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => salvar(false)}
              disabled={salvando}
              className="flex-1 rounded-xl border border-slate-300 py-4 font-sans font-semibold text-navy hover:bg-slate-50 disabled:opacity-60"
            >
              Salvar como rascunho
            </button>

            <button
              onClick={() => salvar(true)}
              disabled={salvando}
              className="flex-1 rounded-xl bg-gold py-4 font-sans font-semibold text-white hover:bg-gold-dark disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Publicar"}
            </button>

          </div>

        </div>

      </div>

    </AppShell>
  );
}
