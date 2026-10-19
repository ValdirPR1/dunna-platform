import Image from "next/image";
import Link from "next/link";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";

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
      className="group block overflow-hidden bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
    >

      <div className="relative h-72 w-full overflow-hidden">

        <Image
          src={imagem || "https://placehold.co/800x600"}
          alt={nome}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          unoptimized={SEM_OTIMIZACAO_IMAGEM}
        />

        {status && (
          <span className="rotulo-luxo absolute left-4 top-4 bg-gold px-3 py-1.5 text-white">
            {status}
          </span>
        )}

      </div>

      <div className="p-7">

        <p className="rotulo-luxo text-gold-dark">
          {cidade}
        </p>

        <h3 className="mt-3 font-display text-xl font-normal text-navy">
          {nome}
        </h3>

      </div>

    </Link>
  );
}
