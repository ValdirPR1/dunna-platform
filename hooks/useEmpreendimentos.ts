"use client";

import { useEffect, useState } from "react";
import { Empreendimento } from "@/types/empreendimento";
import { listarEmpreendimentos } from "@/services/empreendimentoService";

export function useEmpreendimentos() {
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    try {
      const dados = await listarEmpreendimentos();
      setEmpreendimentos(dados);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return {
    empreendimentos,
    loading,
    atualizar: carregar,
  };
}