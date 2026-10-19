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
    <section className="bg-white py-28">

      <div className="mx-auto max-w-7xl px-6">

        <BlogIntro />

        <div className="grid gap-8 md:grid-cols-3">

          {posts.map((post) => (

            <Link
              key={post.id}
              href={`/site/blog/${post.slug}`}
              className="group overflow-hidden bg-[#f5f1ec] transition duration-500 hover:shadow-xl"
            >

              {post.imagem_capa && (
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={post.imagem_capa}
                    alt={post.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    unoptimized={SEM_OTIMIZACAO_IMAGEM}
                  />
                </div>
              )}

              <div className="p-7">

                {post.categoria && (
                  <span className="rotulo-luxo text-gold-dark">
                    {post.categoria}
                  </span>
                )}

                <h3 className="mt-3 font-display text-xl font-normal leading-snug text-navy">
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
