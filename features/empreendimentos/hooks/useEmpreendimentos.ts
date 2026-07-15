"use client";

import { useEffect, useState } from "react";

import { Empreendimento } from "../types/empreendimento";

import {
  listarEmpreendimentos,
  excluirEmpreendimento,
} from "../services/empreendimentos.service";

export function useEmpreendimentos() {

  const [empreendimentos, setEmpreendimentos] =
    useState<Empreendimento[]>([]);

  const [loading, setLoading] = useState(true);

  async function carregar() {

    try {

      setLoading(true);

      const dados =
        await listarEmpreendimentos();

      setEmpreendimentos(dados);

    } finally {

      setLoading(false);

    }

  }

  async function remover(id: string) {

    await excluirEmpreendimento(id);

    setEmpreendimentos((old) =>
      old.filter((item) => item.id !== id)
    );

  }

  useEffect(() => {

    carregar();

  }, []);

  return {

    empreendimentos,

    loading,

    atualizar: carregar,

    remover,

  };

}