"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { UnidadeFormData } from "../types/unidadeForm";
import { criarUnidade } from "../services/unidade.service";

import StepDados from "../wizard/StepDados";
import StepCaracteristicas from "../wizard/StepCaracteristicas";
import StepValores from "../wizard/StepValores";
import StepMidias from "../wizard/StepMidias";

const etapas = [
  "Dados",
  "Características",
  "Valores",
  "Mídias",
];

interface Props {
  empreendimentoId: string;
}

export default function UnidadeWizard({
  empreendimentoId,
}: Props) {
  const router = useRouter();

  const [etapa, setEtapa] = useState(0);

  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState<UnidadeFormData>({
    empreendimentoId,

    numero: "",

    bloco: "",

    torre: "",

    andar: "",

    tipologia: "",

    status: "Disponível",

    quartos: "",

    suites: "",

    banheiros: "",

    vagas: "",

    areaPrivativa: "",

    areaTotal: "",

    precoTabela: "",

    precoPromocional: "",

    comissao: "",

    posicaoSolar: "",

    vista: "",

    observacoes: "",
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

      await criarUnidade(form);

      router.push(`/empreendimentos/${empreendimentoId}`);
    } catch (error) {
      console.error(error);

      alert("Erro ao salvar unidade.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

      <div className="mb-10">

        <h2 className="text-3xl font-bold text-white">
          Nova Unidade
        </h2>

        <p className="mt-2 text-zinc-500">
          Etapa {etapa + 1} de {etapas.length}
        </p>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-800">

          <div
            className="h-full rounded-full bg-[#C8A96A] transition-all duration-500"
            style={{
              width: `${((etapa + 1) / etapas.length) * 100}%`,
            }}
          />

        </div>

      </div>

      {etapa === 0 && (
        <StepDados
          form={form}
          setForm={setForm}
        />
      )}

      {etapa === 1 && (
  <StepCaracteristicas
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
  <StepMidias />
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
          disabled={salvando}
          onClick={() => {
            if (etapa === etapas.length - 1) {
              finalizar();
            } else {
              proximo();
            }
          }}
          className="rounded-xl bg-[#C8A96A] px-8 py-3 font-semibold text-black hover:brightness-110 disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : etapa === etapas.length - 1
              ? "Finalizar"
              : "Próximo"}
        </button>

      </div>

    </div>
  );
}