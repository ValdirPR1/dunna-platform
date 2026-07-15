"use client";

import { useEffect, useState } from "react";

import {
  listarImoveis,
  excluirImovel,
} from "../services/imoveis.service";

import { Imovel } from "../types/imovel";

export function useImoveis() {

  const [loading, setLoading] = useState(true);

  const [imoveis, setImoveis] =
    useState<Imovel[]>([]);

  async function carregar() {

    setLoading(true);

    try {

      const dados =
        await listarImoveis();

      setImoveis(dados);

    } finally {

      setLoading(false);

    }

  }

  async function remover(
    id: string
  ) {

    await excluirImovel(id);

    setImoveis((old) =>
      old.filter((i) => i.id !== id)
    );

  }

  useEffect(() => {

    carregar();

  }, []);

  return {

    loading,

    imoveis,

    atualizar: carregar,

    remover,

  };

}