import Link from "next/link";

interface Props {
  id: string;
  nome: string;
  cidade: string;
  status: string;
}

export default function EmpreendimentoCard({
  id,
  nome,
  cidade,
  status,
}: Props) {
  return (
    <Link
      href={`/empreendimentos/${id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
    >

      <div className="mb-5 h-40 rounded-xl bg-slate-100" />

      <h2 className="font-display text-lg font-semibold text-navy">
        {nome}
      </h2>

      <p className="mt-1 font-sans text-slate-500">
        {cidade}
      </p>

      <span className="mt-5 inline-flex rounded-full bg-gold/10 px-3 py-1 font-sans text-sm font-medium text-gold">
        {status}
      </span>

    </Link>
  );
}
