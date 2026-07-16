interface Props {
  nome: string;
  cidade: string;
  status: string;
}

export default function EmpreendimentoCard({
  nome,
  cidade,
  status,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      <div className="mb-5 h-40 rounded-xl bg-slate-100" />

      <h2 className="text-lg font-semibold text-slate-900">
        {nome}
      </h2>

      <p className="mt-1 text-slate-500">
        {cidade}
      </p>

      <span className="mt-5 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
        {status}
      </span>

    </div>
  );
}