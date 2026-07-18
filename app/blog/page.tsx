"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import {
  listarPosts,
  excluirPost,
  BlogPost,
} from "@/features/blog/services/blog.service";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    setPosts(await listarPosts());
    setLoading(false);
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este artigo? Essa ação não pode ser desfeita.")) return;

    try {
      await excluirPost(id);
      toast.success("Artigo excluído.");
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
            Blog
          </h1>
          <p className="mt-2 font-sans text-slate-500">
            Artigos sobre mercado imobiliário, publicados no site.
          </p>
        </div>

        <Link
          href="/blog/novo"
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          <Plus size={18} />
          Novo Artigo
        </Link>

      </div>

      {loading ? (

        <p className="font-sans text-slate-400">Carregando...</p>

      ) : posts.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <p className="font-sans text-slate-500">
            Nenhum artigo criado ainda.
          </p>
        </div>

      ) : (

        <div className="space-y-4">

          {posts.map((post) => (

            <div
              key={post.id}
              className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >

              {post.imagem_capa && (
                <img
                  src={post.imagem_capa}
                  alt={post.titulo}
                  className="h-16 w-24 shrink-0 rounded-xl object-cover"
                />
              )}

              <div className="flex-1">
                <h2 className="font-display font-semibold text-navy">
                  {post.titulo}
                </h2>
                <div className="mt-1 flex items-center gap-3 font-sans text-sm text-slate-400">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-semibold ${
                      post.publicado
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {post.publicado ? "Publicado" : "Rascunho"}
                  </span>
                  {post.categoria && <span>{post.categoria}</span>}
                </div>
              </div>

              <div className="flex gap-2">

                {post.publicado && (
                  <Link
                    href={`/site/blog/${post.slug}`}
                    target="_blank"
                    className="flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-navy hover:bg-slate-50"
                  >
                    <ExternalLink size={16} />
                  </Link>
                )}

                <Link
                  href={`/blog/${post.id}/editar`}
                  className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 font-sans text-sm font-semibold text-navy hover:bg-slate-50"
                >
                  Editar
                </Link>

                <button
                  onClick={() => excluir(post.id)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </AppShell>
  );
}
