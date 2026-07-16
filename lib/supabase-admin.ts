// ATENÇÃO: este arquivo usa a chave "service_role" e só pode ser
// importado em código que roda no servidor (API routes). Nunca
// importe isso em um componente "use client" ou ele vai vazar a
// chave secreta para o navegador.

import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
