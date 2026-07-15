"use client";

import { EmpreendimentoFormData } from "../types/empreendimentoForm";

interface Props {
  form: EmpreendimentoFormData;
  setForm: React.Dispatch<React.SetStateAction<EmpreendimentoFormData>>;
}

export default function StepDadosGerais({
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
          Dados Gerais
        </h3>

        <p className="mt-2 text-zinc-500">
          Informe as informações básicas do empreendimento.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <Campo
          label="Nome do Empreendimento"
          name="nome"
          value={form.nome}
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

        <Campo
          label="Cidade"
          name="cidade"
          value={form.cidade}
          onChange={alterar}
        />

        <Campo
          label="Bairro"
          name="bairro"
          value={form.bairro}
          onChange={alterar}
        />

        <Campo
          label="Estado"
          name="estado"
          value={form.estado}
          onChange={alterar}
        />

        <Campo
          label="CEP"
          name="cep"
          value={form.cep}
          onChange={alterar}
        />

      </div>

      <CampoGrande
        label="Endereço Completo"
        name="endereco"
        value={form.endereco}
        onChange={alterar}
      />

      <div className="grid grid-cols-2 gap-6">

        <Campo
          label="Latitude"
          name="latitude"
          value={form.latitude}
          onChange={alterar}
        />

        <Campo
          label="Longitude"
          name="longitude"
          value={form.longitude}
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

      <label className="mb-2 block text-sm font-medium text-zinc-400">
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

function CampoGrande({
  label,
  name,
  value,
  onChange,
}: CampoProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-400">
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