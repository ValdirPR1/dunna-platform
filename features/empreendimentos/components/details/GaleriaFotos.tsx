interface Foto {
  id: string;
  url: string;
}

interface Props {
  fotos: Foto[];
}

export default function GaleriaFotos({ fotos }: Props) {
  if (fotos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center">
        <p className="font-sans text-slate-400">
          Nenhuma foto cadastrada ainda. Adicione fotos editando este
          empreendimento.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 font-display text-xl font-bold text-navy">
        Fotos
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        {fotos.map((foto) => (
          <img
            key={foto.id}
            src={foto.url}
            alt="Foto do empreendimento"
            className="h-40 w-full rounded-2xl object-cover transition hover:opacity-90"
          />
        ))}

      </div>

    </div>
  );
}
