interface Props {
  realizado: number;
  alvo: number;
}

export default function BarraProgresso({ realizado, alvo }: Props) {
  const percentual = alvo > 0 ? Math.min(100, Math.round((realizado / alvo) * 100)) : 0;
  const bateu = alvo > 0 && realizado >= alvo;

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${
            bateu ? "bg-emerald-500" : "bg-gold"
          }`}
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
