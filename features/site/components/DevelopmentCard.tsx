import Image from "next/image";
import Link from "next/link";
import { SEM_OTIMIZACAO_IMAGEM } from "@/lib/imagemConfig";

interface Props {
  slug: string;
  nome: string;
  cidade: string;
  status?: string | null;
  imagem?: string | null;
  valorInicial?: number | null;
}

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

// Mesmo estilo dos cartões de imóvel: foto inteira com os textos por
// cima e um degradê escuro dourado que aparece ao passar o mouse.
export default function DevelopmentCard({
  slug,
  nome,
  cidade,
  status,
  imagem,
  valorInicial,
}: Props) {
  return (
    <Link
      href={`/site/empreendimentos/${slug}`}
      className="group relative block h-[440px] w-full overflow-hidden bg-gradient-to-br from-[#d9cfc2] via-[#c9bcab] to-[#b8a88f] shadow-sm"
    >

      <Image
        src={imagem || "https://placehold.co/800x600"}
        alt={nome}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        unoptimized={SEM_OTIMIZACAO_IMAGEM}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#1c1a17]/65 to-gold-dark/35 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />

      {status && (
        <span className="rotulo-luxo absolute left-5 top-5 z-10 bg-gold px-3 py-1.5 text-white">
          {status}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">

        {cidade && (
          <p className="rotulo-luxo text-white/75">{cidade}</p>
        )}

        <h3 className="mt-3 line-clamp-2 font-display text-xl font-light leading-snug text-white sm:text-2xl">
          {nome}
        </h3>

        {valorInicial ? (
          <div className="mt-5 border-t border-white/20 pt-4">
            <p className="font-sans text-xs uppercase tracking-widest text-white/60">
              A partir de
            </p>
            <p className="mt-1 font-display text-2xl font-light text-white">
              {formatarPreco(valorInicial)}
            </p>
          </div>
        ) : null}

      </div>

    </Link>
  );
}
