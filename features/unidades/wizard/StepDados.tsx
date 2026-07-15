"use client";

import { UnidadeFormData } from "../types/unidadeForm";

interface Props {
  form: UnidadeFormData;
  setForm: React.Dispatch<
    React.SetStateAction<UnidadeFormData>
  >;
}

export default function StepDados({
  form,
  setForm,
}: Props) {

  function alterar(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
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
          Dados da Unidade
        </h2>

        <p className="mt-2 text-zinc-500">
          Informações básicas da unidade.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <Campo
          label="Número"
          name="numero"
          value={form.numero}
          onChange={alterar}
        />

        <Campo
          label="Bloco"
          name="bloco"
          value={form.bloco}
          onChange={alterar}
        />

        <Campo
          label="Torre"
          name="torre"
          value={form.torre}
          onChange={alterar}
        />

        <Campo
          label="Andar"
          name="andar"
          value={form.andar}
          onChange={alterar}
        />

        <Campo
          label="Tipologia"
          name="tipologia"
          value={form.tipologia}
          onChange={alterar}
        />

        <div>

          <label className="mb-2 block text-sm text-zinc-400">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={alterar}
            className="h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 text-white"
          >
            <option>Disponível</option>
            <option>Reservada</option>
            <option>Vendida</option>
          </select>

        </div>

      </div>

    </div>
  );
}

interface CampoProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

function Campo({
  label,
  name,
  value,
  onChange,
}: CampoProps) {
  return (
    <div>

      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 text-white"
      />

    </div>
  );
}