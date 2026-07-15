"use client";

import { useEffect, useState } from "react";

import { listarUnidades } from "../services/unidade.service";
import { Unidade } from "../types/unidade";

export function useUnidades(
  empreendimentoId: string
) {

  const [loading, setLoading] = useState(true);

  const [unidades, setUnidades] =
    useState<Unidade[]>([]);

  async function carregar() {

    if (!empreendimentoId) return;

    setLoading(true);

    try {

      const dados =
        await listarUnidades(
          empreendimentoId
        );

      setUnidades(dados);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    carregar();

  }, [empreendimentoId]);

  return {

    unidades,

    loading,

    atualizar: carregar,

  };

}