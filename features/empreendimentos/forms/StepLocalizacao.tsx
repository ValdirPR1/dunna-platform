"use client";

import FormSection from "@/components/ui/form/FormSection";
import TextField from "@/components/ui/form/TextField";
import { UseFormRegister } from "react-hook-form";
import { EmpreendimentoFormData } from "./schema";

interface Props {
  register: UseFormRegister<EmpreendimentoFormData>;
}

export default function StepLocalizacao({ register }: Props) {
  return (
    <FormSection title="Localização">
      <div className="grid grid-cols-2 gap-6">
        <TextField label="Cidade" {...register("cidade")} />
        <TextField label="Bairro" {...register("bairro")} />
        <TextField label="Endereço" {...register("endereco")} />
      </div>
    </FormSection>
  );
}