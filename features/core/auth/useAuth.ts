"use client";

import { useEffect, useState } from "react";
import { buscarUsuarioLogado, UsuarioLogado } from "./auth.service";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    const dados = await buscarUsuarioLogado();
    setUsuario(dados);
    setLoading(false);
  }

  useEffect(() => {
    carregar();

    const { data: assinatura } = supabase.auth.onAuthStateChange(() => {
      carregar();
    });

    return () => assinatura.subscription.unsubscribe();
  }, []);

  return { usuario, loading, recarregar: carregar };
}
