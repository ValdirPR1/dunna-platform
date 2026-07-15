"use client";

import { EmpreendimentoFormData } from "../types/empreendimentoForm";

interface Props {
  form: EmpreendimentoFormData;
  setForm: React.Dispatch<React.SetStateAction<EmpreendimentoFormData>>;
}

export default function StepComercial({
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
    <div className="space-y-10">

      <div>

        <h3 className="text-2xl font-bold text-white">
          Informações Comerciais
        </h3>

        <p className="mt-2 text-zinc-500">
          Defina as informações comerciais do empreendimento.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-6">

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
            <option>Lançamento</option>
            <option>Pré-Lançamento</option>
            <option>Em Obras</option>
            <option>Pronto</option>
          </select>

        </div>

        <Campo
          label="Registro da Incorporação"
          name="registro"
          value={form.registro}
          onChange={alterar}
        />

        <Campo
          label="Previsão de Entrega"
          name="entrega"
          value={form.entrega}
          onChange={alterar}
        />

        <Campo
          label="Construtora"
          name="construtora"
          value={form.construtora}
          onChange={alterar}
        />

        <Campo
          label="Incorporadora"
          name="incorporadora"
          value={form.incorporadora}
          onChange={alterar}
        />

        <Campo
          label="Tipo"
          name="tipo"
          value={form.tipo}
          onChange={alterar}
        />

      </div>

    </div>
  );
}

interface CampoProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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