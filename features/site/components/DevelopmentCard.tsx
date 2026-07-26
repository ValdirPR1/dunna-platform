import Image from "next/image";
import Link from "next/link";

interface Props {
  slug: string;
  nome: string;
  cidade: string;
  status?: string | null;
  imagem?: string | null;
}

export default function DevelopmentCard({
  slug,
  nome,
  cidade,
  status,
  imagem,
}: Props) {
  return (
    <Link
      href={`/site/empreendimentos/${slug}`}
      className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >

      <div className="relative h-72 w-full overflow-hidden">

        <Image
          src={imagem || "https://placehold.co/800x600"}
          alt={nome}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
        />

        {status && (
          <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-white">
            {status}
          </span>
        )}

      </div>

      <div className="p-6">

        <h3 className="font-display text-xl font-semibold text-navy">
          {nome}
        </h3>

        <p className="mt-1.5 font-sans text-sm text-slate-500">
          {cidade}
        </p>

      </div>

    </Link>
  );
}
