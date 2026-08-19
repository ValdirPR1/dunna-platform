"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { criarLeadVendedor } from "../services/leads.service";
import CampoMoeda from "@/components/ui/form/CampoMoeda";
import { useIdioma } from "@/features/idioma/IdiomaContext";

export default function VenderImovelForm() {
  const { t } = useIdioma();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [tipoImovel, setTipoImovel] = useState("Apartamento");
  const [quartos, setQuartos] = useState("");
  const [valorPretendido, setValorPretendido] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar() {
    if (!nome || !telefone || !cidade) {
      setErro(t.vender.form.erroObrigatorio);
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      await criarLeadVendedor({
        nome,
        telefone,
        email,
        cidade,
        bairro,
        tipoImovel,
        quartos,
        valorPretendido,
        observacoes,
      });

      setEnviado(true);
    } catch (e) {
      console.error(e);
      setErro(t.vender.form.erroEnvio);
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CheckCircle2 className="text-emerald-500" size={48} />
        <p className="mt-4 font-sans text-lg font-semibold text-navy">
          {t.vender.form.sucessoTitulo}
        </p>
        <p className="mt-2 font-sans text-slate-500">
          {t.vender.form.sucessoTexto}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="grid gap-4 md:grid-cols-2">

        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder={t.vender.form.nome}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />

        <input
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder={t.vender.form.whatsapp}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />

      </div>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder={t.vender.form.email}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      <div className="grid gap-4 md:grid-cols-2">

        <input
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder={t.vender.form.cidade}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />

        <input
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder={t.vender.form.bairro}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />

      </div>

      <div className="grid gap-4 md:grid-cols-3">

        {/* O valor enviado pro backend continua em português (é o que
            o CRM espera) — só o texto visível da opção muda de idioma. */}
        <select
          value={tipoImovel}
          onChange={(e) => setTipoImovel(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        >
          <option value="Apartamento">{t.vender.form.tipoApartamento}</option>
          <option value="Casa">{t.vender.form.tipoCasa}</option>
          <option value="Terreno">{t.vender.form.tipoTerreno}</option>
          <option value="Comercial">{t.vender.form.tipoComercial}</option>
          <option value="Outro">{t.vender.form.tipoOutro}</option>
        </select>

        <input
          value={quartos}
          onChange={(e) => setQuartos(e.target.value)}
          type="number"
          placeholder={t.vender.form.quartos}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />

        <CampoMoeda
          value={valorPretendido}
          onChange={setValorPretendido}
          placeholder={t.vender.form.valorPretendido}
        />

      </div>

      <textarea
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
        rows={3}
        placeholder={t.vender.form.observacoes}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
      />

      {erro && <p className="font-sans text-sm text-red-500">{erro}</p>}

      <button
        onClick={enviar}
        disabled={enviando}
        className="w-full rounded-xl bg-gold py-4 font-sans text-lg font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
      >
        {enviando ? t.vender.form.enviando : t.vender.form.enviar}
      </button>

    </div>
  );
}
