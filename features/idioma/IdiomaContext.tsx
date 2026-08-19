"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Idioma, dicionario } from "./dicionario";

const CHAVE_STORAGE = "dunna_idioma";

interface IdiomaContextValor {
  idioma: Idioma;
  definirIdioma: (idioma: Idioma) => void;
  t: (typeof dicionario)["pt"];
}

const IdiomaContext = createContext<IdiomaContextValor | null>(null);

export function IdiomaProvider({ children }: { children: ReactNode }) {
  // Começa sempre em "pt" (igual no servidor e no primeiro render do
  // cliente, pra não dar erro de hidratação) — se a pessoa já tinha
  // escolhido outro idioma antes, troca logo em seguida.
  const [idioma, setIdioma] = useState<Idioma>("pt");

  useEffect(() => {
    const salvo = window.localStorage.getItem(CHAVE_STORAGE) as Idioma | null;
    if (salvo && salvo in dicionario) {
      setIdioma(salvo);
    }
  }, []);

  function definirIdioma(novo: Idioma) {
    setIdioma(novo);
    window.localStorage.setItem(CHAVE_STORAGE, novo);
  }

  return (
    <IdiomaContext.Provider
      value={{ idioma, definirIdioma, t: dicionario[idioma] }}
    >
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const contexto = useContext(IdiomaContext);
  if (!contexto) {
    throw new Error("useIdioma precisa estar dentro de um <IdiomaProvider>");
  }
  return contexto;
}
