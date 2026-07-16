"use client";

import { useEffect, useState } from "react";
import {
  listarOportunidades,
  atualizarEtapaOportunidade,
} from "../services/oportunidades.service";
import { Etapa, Oportunidade } from "../types/oportunidade";

export function useOportunidades() {
  const [loading, setLoading] = useState(true);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarOportunidades();
      setOportunidades(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function moverParaEtapa(id: string, novaEtapa: Etapa) {
    // Atualiza a tela na hora (otimista), antes mesmo da resposta do banco
    setOportunidades((prev) =>
      prev.map((o) => (o.id === id ? { ...o, etapa: novaEtapa } : o))
    );

    try {
      await atualizarEtapaOportunidade(id, novaEtapa);
    } catch (error) {
      console.error(error);
      // Se der erro, desfaz a mudança recarregando do banco
      carregar();
    }
  }

  return {
    oportunidades,
    loading,
    atualizar: carregar,
    moverParaEtapa,
  };
}
