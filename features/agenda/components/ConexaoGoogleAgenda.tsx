"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck2,
  CalendarX2,
  ChevronDown,
  Loader2,
  RefreshCw,
  Unlink,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  verificarConexaoGoogle,
  urlConectarGoogleAgenda,
  desconectarGoogleAgenda,
  testarConexaoGoogle,
  sincronizarTudoComGoogle,
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

  const [testando, setTestando] = useState(false);
  const [sincronizandoTudo, setSincronizandoTudo] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora dele.
  useEffect(() => {
    if (!menuAberto) return;

    function aoClicarFora(evento: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(evento.target as Node)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [menuAberto]);

  async function desconectar() {
    await desconectarGoogleAgenda(corretorId);
    setConectado(false);
    setEmail(undefined);
    toast.success("Google Agenda desconectada.");
  }

  async function testar() {
    setTestando(true);
    try {
      const resultado = await testarConexaoGoogle(corretorId);
      if (resultado.ok) {
        toast.success("Tudo certo! Criamos e apagamos um evento de teste na sua agenda.");
      } else {
        toast.error(resultado.erro ?? "A conexão não está funcionando.", {
          duration: 8000,
        });
      }
    } finally {
      setTestando(false);
    }
  }

  async function sincronizarTudo() {
    setSincronizandoTudo(true);
    try {
      const resultado = await sincronizarTudoComGoogle(corretorId);

      if (resultado.sincronizadas === 0 && resultado.falhas === 0) {
        toast.success("Já estava tudo sincronizado — nenhuma tarefa pendente.");
      } else if (resultado.falhas === 0) {
        toast.success(
          `${resultado.sincronizadas} tarefa(s) enviadas pra Google Agenda!`
        );
      } else {
        toast.error(
          `${resultado.sincronizadas} sincronizadas, ${resultado.falhas} falharam: ${
            resultado.erro ?? "erro desconhecido"
          }`,
          { duration: 8000 }
        );
      }
    } finally {
      setSincronizandoTudo(false);
    }
  }

  if (!corretorId || loading) return null;

  if (conectado) {
    return (
      <div ref={menuRef} className="relative inline-block w-full sm:w-auto">
        <button
          onClick={() => setMenuAberto((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-sans text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
          title={email}
        >
          <CalendarCheck2 size={17} />
          Google Agenda conectada
          <ChevronDown
            size={15}
            className={`transition-transform ${menuAberto ? "rotate-180" : ""}`}
          />
        </button>

        {menuAberto && (
          <div className="absolute right-0 z-20 mt-2 w-72 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            <button
              onClick={() => {
                setMenuAberto(false);
                testar();
              }}
              disabled={testando}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left font-sans text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              {testando ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
              {testando ? "Testando..." : "Testar sincronização"}
            </button>

            <button
              onClick={() => {
                setMenuAberto(false);
                sincronizarTudo();
              }}
              disabled={sincronizandoTudo}
              title="Envia pra Google Agenda as tarefas que já existiam antes da conexão funcionar"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left font-sans text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              {sincronizandoTudo ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <UploadCloud size={15} />
              )}
              {sincronizandoTudo ? "Sincronizando..." : "Sincronizar tarefas existentes"}
            </button>

            <div className="my-1 border-t border-slate-100" />

            <button
              onClick={() => {
                setMenuAberto(false);
                desconectar();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left font-sans text-sm text-red-500 transition hover:bg-red-50"
            >
              <Unlink size={15} />
              Desconectar
            </button>
          </div>
        )}
      </div>
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
