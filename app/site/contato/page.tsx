"use client";

import { useState, FormEvent } from "react";
import { criarLeadSite } from "@/features/site/services/leads.service";

type Status = "idle" | "enviando" | "sucesso" | "erro";

export default function ContatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("enviando");

    try {
      await criarLeadSite({ nome, email, telefone, mensagem });
      setStatus("sucesso");
      setNome("");
      setEmail("");
      setTelefone("");
      setMensagem("");
    } catch (error) {
      console.error(error);
      setStatus("erro");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-5xl font-bold">
        Fale com a gente
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-slate-500">
        Preencha o formulário abaixo e um de nossos especialistas
        entra em contato para te ajudar a encontrar o imóvel ideal.
      </p>

      <div className="mt-12 grid gap-16 lg:grid-cols-[2fr_1fr]">

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 p-8 shadow-sm"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nome
              </label>
              <input
                required
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-4"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Telefone
              </label>
              <input
                required
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-4"
                placeholder="(00) 00000-0000"
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              E-mail
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-4"
              placeholder="seu@email.com"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mensagem
            </label>
            <textarea
              required
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 p-4"
              placeholder="Conte um pouco sobre o que você procura"
            />
          </div>

          <button
            type="submit"
            disabled={status === "enviando"}
            className="mt-8 w-full rounded-2xl bg-[#C8A96A] py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {status === "enviando" ? "Enviando..." : "Enviar mensagem"}
          </button>

          {status === "sucesso" && (
            <p className="mt-4 text-center font-semibold text-green-600">
              Mensagem enviada! Em breve entraremos em contato.
            </p>
          )}

          {status === "erro" && (
            <p className="mt-4 text-center font-semibold text-red-600">
              Não foi possível enviar agora. Tente novamente em instantes.
            </p>
          )}

        </form>

        <aside className="h-fit rounded-3xl border border-slate-200 p-8 shadow-sm">

          <h2 className="text-2xl font-bold">
            Outros canais
          </h2>

          <div className="mt-6 space-y-4 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">WhatsApp:</span>{" "}
              (00) 00000-0000
            </p>
            <p>
              <span className="font-semibold text-slate-900">E-mail:</span>{" "}
              contato@dunna.com.br
            </p>
            <p>
              <span className="font-semibold text-slate-900">Endereço:</span>{" "}
              Preencha com o endereço do escritório
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
}
