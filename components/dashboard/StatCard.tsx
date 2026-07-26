"use client";

import { ReactNode, useEffect, useState } from "react";

interface Props {
  title: string;
  numero: number;
  formatar?: (valor: number) => string;
  subtitle: string;
  icon: ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  numero,
  formatar,
  subtitle,
  icon,
  color = "#C8A96A",
}: Props) {
  const [valorAnimado, setValorAnimado] = useState(0);

  useEffect(() => {
    let quadro: number;
    const inicio = performance.now();
    const duracao = 800;
    const de = valorAnimado;

    function animar(agora: number) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      setValorAnimado(Math.round(de + (numero - de) * suavizado));

      if (progresso < 1) {
        quadro = requestAnimationFrame(animar);
      }
    }

    quadro = requestAnimationFrame(animar);

    return () => cancelAnimationFrame(quadro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero]);

  const texto = formatar ? formatar(valorAnimado) : valorAnimado.toString();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:rounded-3xl md:p-6">

      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="truncate text-xs text-slate-500 md:text-sm">
            {title}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 md:mt-2 md:text-4xl">
            {texto}
          </h2>

          <p className="mt-1 truncate text-xs text-slate-500 md:mt-2 md:text-sm">
            {subtitle}
          </p>

        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white md:h-14 md:w-14 md:rounded-2xl"
          style={{ background: color }}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}
