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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            {texto}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>

        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
          style={{ background: color }}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}
