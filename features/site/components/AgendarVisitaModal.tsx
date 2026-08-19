"use client";

import { useState } from "react";
import { X, CalendarCheck, CheckCircle2 } from "lucide-react";
import { criarSolicitacaoVisita } from "../services/leads.service";
import { PAISES_DDI, DDI_PADRAO, montarTelefoneCompleto } from "../utils/telefone";
import { useIdioma } from "@/features/idioma/IdiomaContext";

interface Props {
  imovelTitulo: string;
  corretorId?: string | null;
  aberto: boolean;
  onFechar: () => void;
}

export default function AgendarVisitaModal({
  imovelTitulo,
  corretorId,
  aberto,
  onFechar,
}: Props) {
  const { t } = useIdioma();
  const [nome, setNome] = useState("");
  const [ddi, setDdi] = useState(DDI_PADRAO);
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [periodo, setPeriodo] = useState<"Manhã" | "Tarde" | "Noite">("Manhã");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  if (!aberto) return null;

  async function enviar() {
    if (!nome || !telefone || !data) {
      setErro(t.agendarVisita.erroObrigatorio);
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      await criarSolicitacaoVisita({
        nome,
        telefone: montarTelefoneCompleto(ddi, telefone),
        dataPreferida: data,
        periodo,
        imovelTitulo,
        corretorId,
      });

      setEnviado(true);
    } catch (e) {
      console.error(e);
      setErro(t.agendarVisita.erroEnvio);
    } finally {
      setEnviando(false);
    }
  }

  function fechar() {
    onFechar();
    // Pequeno atraso pra não "piscar" o formulário vazio antes de fechar
    setTimeout(() => {
      setNome("");
      setDdi(DDI_PADRAO);
      setTelefone("");
      setData("");
      setPeriodo("Manhã");
      setEnviado(false);
      setErro("");
    }, 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
      onClick={fechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-2">
            <CalendarCheck className="text-[#C8A96A]" size={22} />
            <h3 className="font-display text-xl font-bold text-navy">
              {t.agendarVisita.botao}
            </h3>
          </div>

          <button onClick={fechar} aria-label={t.agendarVisita.fechar}>
            <X size={20} className="text-slate-400 hover:text-slate-600" />
          </button>

        </div>

        {enviado ? (

          <div className="mt-8 flex flex-col items-center text-center">

            <CheckCircle2 className="text-emerald-500" size={48} />

            <p className="mt-4 font-sans text-lg font-semibold text-navy">
              {t.agendarVisita.recebemos}
            </p>

            <p className="mt-2 font-sans text-slate-500">
              {t.agendarVisita.corretorConfirma}
            </p>

            <button
              onClick={fechar}
              className="mt-6 rounded-xl bg-[#101828] px-6 py-3 font-sans font-semibold text-white"
            >
              {t.agendarVisita.fechar}
            </button>

          </div>

        ) : (

          <div className="mt-6 space-y-4">

            <p className="font-sans text-sm text-slate-500">
              {t.agendarVisita.imovel}: <strong className="text-navy">{imovelTitulo}</strong>
            </p>

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={t.agendarVisita.seuNome}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-[#C8A96A]"
            />

            <div className="flex gap-2">

              <select
                value={ddi}
                onChange={(e) => setDdi(e.target.value)}
                aria-label={t.agendarVisita.codigoPais}
                className="w-28 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-[#C8A96A]"
              >
                {PAISES_DDI.map((pais) => (
                  <option key={pais.ddi} value={pais.ddi}>
                    {pais.bandeira} +{pais.ddi}
                  </option>
                ))}
              </select>

              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                type="tel"
                placeholder={t.agendarVisita.whatsappComDdd}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-[#C8A96A]"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <input
                type="date"
                value={data}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setData(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-[#C8A96A]"
              />

              {/* O valor enviado fica sempre em português (Manhã/Tarde/
                  Noite) — é o que o CRM espera na agenda. Só o texto
                  visível da opção muda com o idioma. */}
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-[#C8A96A]"
              >
                <option value="Manhã">{t.agendarVisita.manha}</option>
                <option value="Tarde">{t.agendarVisita.tarde}</option>
                <option value="Noite">{t.agendarVisita.noite}</option>
              </select>

            </div>

            {erro && (
              <p className="font-sans text-sm text-red-500">{erro}</p>
            )}

            <button
              onClick={enviar}
              disabled={enviando}
              className="w-full rounded-xl bg-[#C8A96A] py-4 font-sans font-semibold text-white transition hover:bg-[#b8955a] disabled:opacity-60"
            >
              {enviando ? t.agendarVisita.enviando : t.agendarVisita.solicitar}
            </button>

          </div>

        )}

      </div>
    </div>
  );
}
