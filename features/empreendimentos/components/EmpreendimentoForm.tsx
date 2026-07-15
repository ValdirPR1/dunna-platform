"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarEmpreendimento } from "@/features/empreendimentos/services/empreendimentos.service";

export default function EmpreendimentoForm() {
  const [form, setForm] = useState({
    nome: "",
    cidade: "",
    bairro: "",
    estado: "PE",
    construtora: "",
    incorporadora: "",
    tipo: "",
    status: "Lançamento",
    valorInicial: "",
    valorFinal: "",
    areaInicial: "",
    areaFinal: "",
    vgv: "",
    descricao: "",
  });
  const router = useRouter();

  function alterar(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

async function salvar() {
  try {
    const empreendimento = await criarEmpreendimento(form);

    router.push(
      `/empreendimentos/${empreendimento.id}`
    );

  } catch (error) {
    console.error(error);

    alert("Erro ao salvar empreendimento.");
  }
}

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="grid grid-cols-2 gap-6">

        <Input
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={alterar}
        />

        <Input
          label="Cidade"
          name="cidade"
          value={form.cidade}
          onChange={alterar}
        />

        <Input
          label="Bairro"
          name="bairro"
          value={form.bairro}
          onChange={alterar}
        />

        <Input
          label="Estado"
          name="estado"
          value={form.estado}
          onChange={alterar}
        />

        <Input
          label="Construtora"
          name="construtora"
          value={form.construtora}
          onChange={alterar}
        />

        <Input
          label="Incorporadora"
          name="incorporadora"
          value={form.incorporadora}
          onChange={alterar}
        />

        <Input
          label="Tipo"
          name="tipo"
          value={form.tipo}
          onChange={alterar}
        />

        <select
          name="status"
          value={form.status}
          onChange={alterar}
          className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white"
        >
          <option>Lançamento</option>
          <option>Em Obras</option>
          <option>Pronto</option>
        </select>

        <Input
          label="Valor Inicial"
          name="valorInicial"
          value={form.valorInicial}
          onChange={alterar}
        />

        <Input
          label="Valor Final"
          name="valorFinal"
          value={form.valorFinal}
          onChange={alterar}
        />

        <Input
          label="Área Inicial"
          name="areaInicial"
          value={form.areaInicial}
          onChange={alterar}
        />

        <Input
          label="Área Final"
          name="areaFinal"
          value={form.areaFinal}
          onChange={alterar}
        />

        <Input
          label="VGV"
          name="vgv"
          value={form.vgv}
          onChange={alterar}
        />

      </div>

      <textarea
        name="descricao"
        value={form.descricao}
        onChange={alterar}
        rows={6}
        placeholder="Descrição"
        className="mt-6 w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white"
      />

      <div className="mt-8 flex justify-end">

        <button
          onClick={salvar}
          className="rounded-xl bg-[#C8A96A] px-8 py-4 font-semibold text-black hover:brightness-110"
        >
          Salvar Empreendimento
        </button>

      </div>

    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function Input({
  label,
  name,
  value,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 text-white"
      />
    </div>
  );
}