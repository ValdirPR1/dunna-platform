"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { criarEmpreendimento } from "../services/empreendimentos.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Stepper from "@/components/ui/form/Stepper";

import StepDadosGerais from "./StepDadosGerais";
import StepLocalizacao from "./StepLocalizacao";
import StepCaracteristicas from "./StepCaracteristicas";
import StepFotos from "./StepFotos";
import StepPublicacao from "./StepPublicacao";
import {
  empreendimentoSchema,
  EmpreendimentoFormData,
} from "./schema";

const steps = [
  "Dados",
  "Localização",
  "Características",
  "Fotos",
  "Publicação",
];

export default function EmpreendimentoWizard() {
  const router = useRouter();

  const [step, setStep] = useState(0);

  const form = useForm<EmpreendimentoFormData>({
    resolver: zodResolver(empreendimentoSchema),

    defaultValues: {

      publicado: false,

      status: "Em lançamento",

    },

  });

 async function salvar(data: EmpreendimentoFormData) {

  const { data: empreendimento, error } =
    await criarEmpreendimento(data);

  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success("Empreendimento criado!");

  router.push(
    `/empreendimentos/${empreendimento.id}`
  );

}

  return (

    <form
      onSubmit={form.handleSubmit(salvar)}
      className="space-y-8"
    >

      <Stepper
        current={step}
        steps={steps}
      />

      {step === 0 && (
        <StepDadosGerais
          register={form.register}
        />
      )}

      {step === 1 && (
        <StepLocalizacao
          register={form.register}
        />
      )}

      {step === 2 && (
        <StepCaracteristicas />
      )}

      {step === 3 && (
        <StepFotos />
      )}

      {step === 4 && (
        <StepPublicacao
          register={form.register}
        />
      )}

      <div className="flex justify-between">

        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
          className="rounded-xl border border-slate-300 px-6 py-3"
        >
          Voltar
        </button>

        {step < steps.length - 1 ? (

          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="rounded-xl bg-[#C8A96A] px-6 py-3 font-semibold text-white"
          >
            Próximo
          </button>

        ) : (

          <button
            type="submit"
            className="rounded-xl bg-[#101828] px-6 py-3 font-semibold text-white"
          >
            Salvar Empreendimento
          </button>

        )}

      </div>

    </form>

  );

}