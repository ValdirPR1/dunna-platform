"use client";

import { useEffect, useState } from "react";
import { buscarUsuarioLogado, UsuarioLogado } from "./auth.service";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregar(mostrarCarregando = false) {
    if (mostrarCarregando) setLoading(true);

    const dados = await buscarUsuarioLogado();
    setUsuario(dados);
    setLoading(false);
  }

  useEffect(() => {
    // Só mostra a tela de "Carregando..." na primeira vez que o app abre
    carregar(true);

    // Quando o Supabase revalida a sessão sozinho (ex: ao voltar pra
    // aba depois de um tempo), atualiza o usuário em segundo plano,
    // sem esconder a tela e sem desmontar o que já estava aberto —
    // isso é o que fazia formulários perderem o que estava sendo digitado.
    const { data: assinatura } = supabase.auth.onAuthStateChange(() => {
      carregar(false);
    });

    return () => assinatura.subscription.unsubscribe();
  }, []);

  return { usuario, loading, recarregar: carregar };
}
