"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarEmpreendimento } from "@/services/empreendimentos";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EmpreendimentoModal({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");
  const [construtora, setConstrutora] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [valorFinal, setValorFinal] = useState("");
  const [vgv, setVgv] = useState("");
  const [descricao, setDescricao] = useState("");

  if (!open) return null;

  async function salvar() {
  if (!nome.trim()) {
    alert("Informe o nome do empreendimento.");
    return;
  }

  try {
    setLoading(true);

    await criarEmpreendimento({
      nome,
      cidade,
      bairro,
      tipo,
      status,
      construtora,
      valor_inicial: Number(valorInicial || 0),
      valor_final: Number(valorFinal || 0),
      vgv: Number(vgv || 0),
      descricao,
    });

    alert("Empreendimento cadastrado com sucesso!");

    setNome("");
    setCidade("");
    setBairro("");
    setTipo("");
    setStatus("");
    setConstrutora("");
    setValorInicial("");
    setValorFinal("");
    setVgv("");
    setDescricao("");

    onClose();
    router.refresh();
  } catch (error: any) {
    console.error(error);

    alert(
      `Mensagem: ${error.message}
Detalhes: ${error.details}
Hint: ${error.hint}
Código: ${error.code}`
    );
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-3xl border border-zinc-800 bg-[#171717] p-8">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold text-white">
              Novo Empreendimento
            </h2>

            <p className="text-zinc-500">
              Cadastre um empreendimento na plataforma.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-5 py-2 text-white hover:bg-zinc-700"
          >
            Fechar
          </button>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            value={construtora}
            onChange={(e) => setConstrutora(e.target.value)}
            placeholder="Construtora"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Tipo"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            type="number"
            value={valorInicial}
            onChange={(e) => setValorInicial(e.target.value)}
            placeholder="Valor Inicial"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            type="number"
            value={valorFinal}
            onChange={(e) => setValorFinal(e.target.value)}
            placeholder="Valor Final"
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />

          <input
            type="number"
            value={vgv}
            onChange={(e) => setVgv(e.target.value)}
            placeholder="VGV"
            className="col-span-2 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
          />
                  </div>

        <textarea
          rows={5}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          className="mt-6 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white"
        />

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-6 py-3 text-white hover:bg-zinc-800"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvar}
            disabled={loading}
            className="rounded-xl bg-[#C8A96A] px-8 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>

        </div>

      </div>
    </div>
  );
}