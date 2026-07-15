"use client";

import { UnidadeFormData } from "../types/unidadeForm";

interface Props {
  form: UnidadeFormData;
  setForm: React.Dispatch<
    React.SetStateAction<UnidadeFormData>
  >;
}

export default function StepCaracteristicas({
  form,
  setForm,
}: Props) {

  function alterar(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
          Características
        </h2>

        <p className="mt-2 text-zinc-500">
          Informações físicas da unidade.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <Campo
          label="Quartos"
          name="quartos"
          value={form.quartos}
          onChange={alterar}
        />

        <Campo
          label="Suítes"
          name="suites"
          value={form.suites}
          onChange={alterar}
        />

        <Campo
          label="Banheiros"
          name="banheiros"
          value={form.banheiros}
          onChange={alterar}
        />

        <Campo
          label="Vagas"
          name="vagas"
          value={form.vagas}
          onChange={alterar}
        />

        <Campo
          label="Área Privativa (m²)"
          name="areaPrivativa"
          value={form.areaPrivativa}
          onChange={alterar}
        />

        <Campo
          label="Área Total (m²)"
          name="areaTotal"
          value={form.areaTotal}
          onChange={alterar}
        />

        <Campo
          label="Posição Solar"
          name="posicaoSolar"
          value={form.posicaoSolar}
          onChange={alterar}
        />

        <Campo
          label="Vista"
          name="vista"
          value={form.vista}
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