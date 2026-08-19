import Image from "next/image";
import Link from "next/link";
import { listarPostsPublicados } from "@/features/blog/services/blog.service";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";
import BlogIntro from "./BlogIntro";

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

export default async function UltimosArtigos() {
  const posts = await listarPostsPublicados(3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        <BlogIntro />

        <div className="grid gap-8 md:grid-cols-3">

          {posts.map((post) => (

            <Link
              key={post.id}
              href={`/site/blog/${post.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-100 shadow-sm transition hover:shadow-lg"
            >

              {post.imagem_capa && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.imagem_capa}
                    alt={post.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={SEM_OTIMIZACAO_IMAGEM}
                  />
                </div>
              )}

              <div className="p-6">

                {post.categoria && (
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-gold">
                    {post.categoria}
                  </span>
                )}

                <h3 className="mt-2 font-display text-lg font-bold text-navy">
                  {post.titulo}
                </h3>

                <p className="mt-3 font-sans text-xs text-slate-400">
                  {formatarData(post.created_at)}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}
