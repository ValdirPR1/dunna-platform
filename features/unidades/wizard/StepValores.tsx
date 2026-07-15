"use client";

import { UnidadeFormData } from "../types/unidadeForm";

interface Props {
  form: UnidadeFormData;
  setForm: React.Dispatch<
    React.SetStateAction<UnidadeFormData>
  >;
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

  const precoTabela =
    Number(form.precoTabela || 0);

  const precoPromo =
    Number(form.precoPromocional || 0);

  const desconto =
    precoTabela > 0
      ? precoTabela - precoPromo
      : 0;

  const percentual =
    precoTabela > 0
      ? (desconto / precoTabela) * 100
      : 0;

  return (
    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-bold text-white">
          Valores
        </h2>

        <p className="mt-2 text-zinc-500">
          Informações comerciais da unidade.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <Campo
          label="Preço de Tabela"
          name="precoTabela"
          value={form.precoTabela}
          onChange={alterar}
        />

        <Campo
          label="Preço Promocional"
          name="precoPromocional"
          value={form.precoPromocional}
          onChange={alterar}
        />

        <Campo
          label="Comissão (%)"
          name="comissao"
          value={form.comissao}
          onChange={alterar}
        />

      </div>

      <div className="grid grid-cols-3 gap-6">

        <Card
          titulo="Desconto"
          valor={desconto.toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
        />

        <Card
          titulo="% de Desconto"
          valor={`${percentual.toFixed(2)}%`}
        />

        <Card
          titulo="Comissão Estimada"
          valor={(
            precoPromo *
            (Number(form.comissao || 0) / 100)
          ).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
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

function Card({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

      <p className="text-sm text-zinc-500">
        {titulo}
      </p>

      <h3 className="mt-3 text-2xl font-bold text-white">
        {valor}
      </h3>

    </div>
  );
}