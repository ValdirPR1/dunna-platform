"use client";

import { useEffect, useState } from "react";

interface Props {
  numero: number;
  prefixo?: string;
}

export default function AnimatedNumber({ numero, prefixo = "" }: Props) {
  const [valorAnimado, setValorAnimado] = useState(0);

  useEffect(() => {
    let quadro: number;
    const inicio = performance.now();
    const duracao = 1200;

    function animar(agora: number) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      setValorAnimado(Math.round(numero * suavizado));

      if (progresso < 1) quadro = requestAnimationFrame(animar);
    }

    quadro = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(quadro);
  }, [numero]);

  return (
    <>
      {prefixo}
      {valorAnimado}
    </>
  );
}
