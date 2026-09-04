"use client";

import { useEffect, useState } from "react";
import {
  listarOportunidades,
  atualizarEtapaOportunidade,
} from "../services/oportunidades.service";
import { Etapa, Oportunidade } from "../types/oportunidade";

// Depois de 30 dias em Pós-venda, o card some do Kanban sozinho — a
// oportunidade continua existindo normalmente (com todo o histórico
// visível em Clientes), só para de aparecer aqui, pra a coluna
// Pós-venda não virar um acúmulo interminável de vendas antigas.
const DIAS_VISIVEL_POS_VENDA = 30;

function estaVisivelNoKanban(o: Oportunidade): boolean {
  if (o.etapa !== "Pós-venda") return true;

  // Por segurança, se por algum motivo não tiver a data de fechamento
  // registrada, não esconde — melhor aparecer do que sumir sem
  // explicação.
  if (!o.venda_fechada_em) return true;

  const diasFechada =
    (Date.now() - new Date(o.venda_fechada_em).getTime()) /
    (1000 * 60 * 60 * 24);

  return diasFechada <= DIAS_VISIVEL_POS_VENDA;
}

export function useOportunidades() {
  const [loading, setLoading] = useState(true);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarOportunidades();
      setOportunidades(data.filter(estaVisivelNoKanban));
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
