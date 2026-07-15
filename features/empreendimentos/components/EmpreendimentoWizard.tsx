"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import StepDadosGerais from "../wizard/StepDadosGerais";
import StepComercial from "../wizard/StepComercial";
import StepValores from "../wizard/StepValores";
import StepDescricao from "../wizard/StepDescricao";
import StepMidias from "../wizard/StepMidias";

import {
  criarEmpreendimento,
  atualizarEmpreendimento,
} from "../services/empreendimentos.service";

import { EmpreendimentoFormData } from "../types/empreendimentoForm";

const etapas = [
  "Dados Gerais",
  "Comercial",
  "Valores",
  "Descrição",
  "Mídias",
];

interface Props {
  modo?: "novo" | "editar";
  empreendimentoId?: string;
  initialData?: Partial<EmpreendimentoFormData>;
}

export default function EmpreendimentoWizard({
  modo = "novo",
  empreendimentoId,
  initialData,
}: Props) {

  const router = useRouter();

  const [etapa, setEtapa] = useState(0);

  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState<EmpreendimentoFormData>({
    nome: "",
    cidade: "",
    bairro: "",
    estado: "",
    cep: "",
    endereco: "",
    latitude: "",
    longitude: "",
    construtora: "",
    incorporadora: "",
    tipo: "",
    status: "Lançamento",
    entrega: "",
    registro: "",
    valorInicial: "",
    valorFinal: "",
    areaInicial: "",
    areaFinal: "",
    vgv: "",
    descricao: "",
    diferenciais: "",
    infraestrutura: "",
    lazer: "",
    publico: "",
    ...initialData,
  });

  function proximo() {
    if (etapa < etapas.length - 1) {
      setEtapa((old) => old + 1);
    }
  }

  function voltar() {
    if (etapa > 0) {
      setEtapa((old) => old - 1);
    }
  }

  async function finalizar() {
  try {

    setSalvando(true);

    if (modo === "editar" && empreendimentoId) {

      await atualizarEmpreendimento(
        empreendimentoId,
        form
      );

      router.push(
        `/empreendimentos/${empreendimentoId}`
      );

      return;
    }

    const empreendimento =
      await criarEmpreendimento(form);

    router.push(
      `/empreendimentos/${empreendimento.id}`
    );

  } catch (error: any) {

    console.error(error);

    alert(error.message);

  } finally {

    setSalvando(false);

  }
}

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

      <div className="mb-10">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold text-white">

              {modo === "editar"
                ? "Editar Empreendimento"
                : "Novo Empreendimento"}

            </h2>

            <p className="mt-2 text-zinc-500">

              Etapa {etapa + 1} de {etapas.length}

            </p>

          </div>

          <span className="rounded-full bg-[#C8A96A]/10 px-5 py-2 text-sm font-semibold text-[#C8A96A]">

            {etapas[etapa]}

          </span>

        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-zinc-800">

          <div
            className="h-full rounded-full bg-[#C8A96A] transition-all duration-500"
            style={{
              width: `${((etapa + 1) / etapas.length) * 100}%`,
            }}
          />

        </div>

      </div>

      {etapa === 0 && (
        <StepDadosGerais
          form={form}
          setForm={setForm}
        />
      )}

      {etapa === 1 && (
        <StepComercial
          form={form}
          setForm={setForm}
        />
      )}

      {etapa === 2 && (
        <StepValores
          form={form}
          setForm={setForm}
        />
      )}

      {etapa === 3 && (
        <StepDescricao
          form={form}
          setForm={setForm}
        />
      )}

      {etapa === 4 && (
        <StepMidias
          form={form}
          setForm={setForm}
        />
      )}

      <div className="mt-12 flex justify-between">

        <button
          onClick={voltar}
          disabled={etapa === 0}
          className="rounded-xl border border-zinc-700 px-6 py-3 text-white disabled:opacity-40"
        >
          Voltar
        </button>

        <button
          onClick={
            etapa === etapas.length - 1
              ? finalizar
              : proximo
          }
          disabled={salvando}
          className="rounded-xl bg-[#C8A96A] px-8 py-3 font-semibold text-black hover:brightness-110 disabled:opacity-60"
        >
          {salvando
            ? "Salvando..."
            : etapa === etapas.length - 1
              ? modo === "editar"
                ? "Salvar Alterações"
                : "Finalizar Cadastro"
              : "Próximo"}
        </button>

      </div>

    </div>
  );
}