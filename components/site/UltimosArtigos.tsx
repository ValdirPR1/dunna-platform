import Link from "next/link";
import { listarPostsPublicados } from "@/features/blog/services/blog.service";

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

        <div className="mb-14 flex items-end justify-between">

          <div>
            <span className="font-sans font-semibold text-gold">
              BLOG
            </span>
            <h2 className="mt-3 font-display text-5xl font-bold text-navy">
              Mercado imobiliário e novidades
            </h2>
          </div>

          <Link
            href="/site/blog"
            className="hidden font-sans font-semibold text-gold hover:underline md:block"
          >
            Ver todos os artigos →
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {posts.map((post) => (

            <Link
              key={post.id}
              href={`/site/blog/${post.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-100 shadow-sm transition hover:shadow-lg"
            >

              {post.imagem_capa && (
                <div className="overflow-hidden">
                  <img
                    src={post.imagem_capa}
                    alt={post.titulo}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
