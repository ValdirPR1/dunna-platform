"use client";

import { EmpreendimentoFormData } from "../types/empreendimentoForm";

interface Props {
  form: EmpreendimentoFormData;
  setForm: React.Dispatch<React.SetStateAction<EmpreendimentoFormData>>;
}

export default function StepValores({
  form,
  setForm,
}: Props) {

  function alterar(
    e: React.ChangeEvent<HTMLInputElement>
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
          Valores e Áreas
        </h3>

        <p className="mt-2 text-zinc-500">
          Informe os valores comerciais do empreendimento.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <Campo
          label="Valor Inicial"
          name="valorInicial"
          value={form.valorInicial}
          onChange={alterar}
        />

        <Campo
          label="Valor Final"
          name="valorFinal"
          value={form.valorFinal}
          onChange={alterar}
        />

        <Campo
          label="Área Inicial (m²)"
          name="areaInicial"
          value={form.areaInicial}
          onChange={alterar}
        />

        <Campo
          label="Área Final (m²)"
          name="areaFinal"
          value={form.areaFinal}
          onChange={alterar}
        />

      </div>

      <Campo
        label="VGV"
        name="vgv"
        value={form.vgv}
        onChange={alterar}
      />

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
        className="h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 text-white outline-none transition focus:border-[#C8A96A]"
      />

    </div>
  );
}