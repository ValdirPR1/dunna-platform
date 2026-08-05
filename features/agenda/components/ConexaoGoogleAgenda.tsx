"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, CalendarX2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  verificarConexaoGoogle,
  urlConectarGoogleAgenda,
  desconectarGoogleAgenda,
} from "../services/googleAgenda.service";

interface Props {
  corretorId: string;
  returnTo?: string;
}

export default function ConexaoGoogleAgenda({ corretorId, returnTo }: Props) {
  const [conectado, setConectado] = useState(false);
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!corretorId) return;

    function conferir() {
      verificarConexaoGoogle(corretorId).then((res) => {
        setConectado(res.conectado);
        setEmail(res.googleEmail);
        setLoading(false);
      });
    }

    conferir();

    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "conectado") {
      toast.success("Google Agenda conectada com sucesso!");
    } else if (params.get("google") === "erro") {
      toast.error("Não foi possível conectar a Google Agenda.");
    }

    // O link de conectar abre numa aba/navegador externo (necessário
    // pro login do Google funcionar dentro do app instalado no
    // iPhone) — quando a pessoa volta pro app depois de autorizar, o
    // status precisa ser reconferido, já que essa aba não recarrega
    // a tela que ficou aberta aqui.
    function aoVoltarParaAba() {
      if (document.visibilityState === "visible") conferir();
    }

    document.addEventListener("visibilitychange", aoVoltarParaAba);
    window.addEventListener("focus", conferir);

    return () => {
      document.removeEventListener("visibilitychange", aoVoltarParaAba);
      window.removeEventListener("focus", conferir);
    };
  }, [corretorId]);

  async function desconectar() {
    await desconectarGoogleAgenda(corretorId);
    setConectado(false);
    setEmail(undefined);
    toast.success("Google Agenda desconectada.");
  }

  if (!corretorId || loading) return null;

  if (conectado) {
    return (
      <button
        onClick={desconectar}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-sans text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto sm:justify-start"
        title={email}
      >
        <CalendarCheck2 size={17} />
        Google Agenda conectada
      </button>
    );
  }

  return (
    <a
      href={urlConectarGoogleAgenda(corretorId, returnTo)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto sm:justify-start"
    >
      <CalendarX2 size={17} />
      Conectar Google Agenda
    </a>
  );
}
