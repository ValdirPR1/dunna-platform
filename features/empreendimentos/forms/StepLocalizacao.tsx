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

      <div className="mt-6">
        <label className="mb-2 block font-sans text-sm font-medium text-slate-600">
          Sobre a região (aparece na página pública)
        </label>
        <textarea
          {...register("localizacaoTexto")}
          rows={4}
          placeholder="Ex: A poucos minutos da praia, com fácil acesso a mercados, restaurantes e a rodovia principal..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />
      </div>
    </FormSection>
  );
}