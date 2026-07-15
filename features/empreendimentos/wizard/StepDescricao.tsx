"use client";

import { EmpreendimentoFormData } from "../types/empreendimentoForm";

interface Props {
  form: EmpreendimentoFormData;
  setForm: React.Dispatch<
    React.SetStateAction<EmpreendimentoFormData>
  >;
}

export default function StepDescricao({
  form,
  setForm,
}: Props) {

  function alterar(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-bold text-white">
          Conteúdo do Empreendimento
        </h2>

        <p className="mt-2 text-zinc-500">
          Essas informações serão utilizadas automaticamente no site da Dunna.
        </p>

      </div>

      <Campo
        titulo="Descrição Completa"
        name="descricao"
        value={form.descricao}
        onChange={alterar}
        rows={8}
      />

      <Campo
        titulo="Diferenciais"
        name="diferenciais"
        value={form.diferenciais}
        onChange={alterar}
        rows={6}
      />

      <Campo
        titulo="Infraestrutura"
        name="infraestrutura"
        value={form.infraestrutura}
        onChange={alterar}
        rows={6}
      />

      <Campo
        titulo="Área de Lazer"
        name="lazer"
        value={form.lazer}
        onChange={alterar}
        rows={6}
      />

      <Campo
        titulo="Público-alvo"
        name="publico"
        value={form.publico}
        onChange={alterar}
        rows={4}
      />

    </div>
  );
}

interface CampoProps {
  titulo: string;
  name: string;
  value: string;
  rows: number;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

function Campo({
  titulo,
  name,
  value,
  rows,
  onChange,
}: CampoProps) {
  return (
    <div>

      <label className="mb-3 block text-sm font-medium text-zinc-400">
        {titulo}
      </label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-5 text-white outline-none transition focus:border-[#C8A96A]"
      />

    </div>
  );
}