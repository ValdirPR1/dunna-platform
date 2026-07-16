interface Props {
  nome: string;
  cidade: string;
}

export default function EmpreendimentoHeader({
  nome,
  cidade,
}: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#101828] to-slate-800 p-10 text-white">

      <p className="text-slate-300">

        Empreendimento

      </p>

      <h1 className="mt-3 text-5xl font-bold">

        {nome}

      </h1>

      <p className="mt-3 text-lg text-slate-300">

        {cidade}

      </p>

    </div>
  );
}