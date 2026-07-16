"use client";

import { UseFormRegister } from "react-hook-form";
import { EmpreendimentoFormData } from "./schema";

import TextField from "@/components/ui/form/TextField";
import TextArea from "@/components/ui/form/TextArea";
import FormSection from "@/components/ui/form/FormSection";

interface Props {
  register: UseFormRegister<EmpreendimentoFormData>;
}

export default function StepDadosGerais({
  register,
}: Props) {
  return (
    <FormSection
      title="Dados Gerais"
      description="Informações principais do empreendimento."
    >
      <div className="grid gap-6 md:grid-cols-2">

        <TextField
          label="Nome"
          {...register("nome")}
        />

        <TextField
          label="Construtora"
          {...register("construtora")}
        />

        <TextField
          label="Incorporadora"
          {...register("incorporadora")}
        />

        <TextField
          label="Status"
          {...register("status")}
        />

      </div>

      <div className="mt-6">

        <TextArea
          label="Descrição"
          {...register("descricao")}
        />

      </div>

    </FormSection>
  );
}