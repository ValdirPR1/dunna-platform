"use client";

import { useState, FormEvent } from "react";
import { criarLeadSite } from "@/features/site/services/leads.service";
import { PAISES_DDI, DDI_PADRAO, montarTelefoneCompleto } from "@/features/site/utils/telefone";
import { useIdioma } from "@/features/idioma/IdiomaContext";

type Status = "idle" | "enviando" | "sucesso" | "erro";

export default function ContatoForm() {
  const { t } = useIdioma();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [ddi, setDdi] = useState(DDI_PADRAO);
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("enviando");

    try {
      await criarLeadSite({
        nome,
        email,
        telefone: montarTelefoneCompleto(ddi, telefone),
        mensagem,
      });
      setStatus("sucesso");
      setNome("");
      setEmail("");
      setDdi(DDI_PADRAO);
      setTelefone("");
      setMensagem("");
    } catch (error) {
      console.error(error);
      setStatus("erro");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 p-8 shadow-sm"
    >

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            {t.contato.form.nome}
          </label>
          <input
            required
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-4"
            placeholder={t.contato.form.nomePlaceholder}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            {t.contato.form.telefone}
          </label>
          <div className="flex gap-2">

            <select
              value={ddi}
              onChange={(e) => setDdi(e.target.value)}
              aria-label={t.contato.form.codigoPais}
              className="w-28 shrink-0 rounded-xl border border-slate-200 p-4"
            >
              {PAISES_DDI.map((pais) => (
                <option key={pais.ddi} value={pais.ddi}>
                  {pais.bandeira} +{pais.ddi}
                </option>
              ))}
            </select>

            <input
              required
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-4"
              placeholder={t.contato.form.telefonePlaceholder}
            />

          </div>
        </div>

      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {t.contato.form.email}
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 p-4"
          placeholder={t.contato.form.emailPlaceholder}
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {t.contato.form.mensagem}
        </label>
        <textarea
          required
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-slate-200 p-4"
          placeholder={t.contato.form.mensagemPlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={status === "enviando"}
        className="mt-8 w-full rounded-2xl bg-[#C8A96A] py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "enviando" ? t.contato.form.enviando : t.contato.form.enviar}
      </button>

      {status === "sucesso" && (
        <p className="mt-4 text-center font-semibold text-green-600">
          {t.contato.form.sucesso}
        </p>
      )}

      {status === "erro" && (
        <p className="mt-4 text-center font-semibold text-red-600">
          {t.contato.form.erro}
        </p>
      )}

    </form>
  );
}
