"use client";

import { UseFormRegister } from "react-hook-form";
import { EmpreendimentoFormData } from "./schema";

import TextField from "@/components/ui/form/TextField";
import FormSection from "@/components/ui/form/FormSection";

interface Props {
  register: UseFormRegister<EmpreendimentoFormData>;
}

export default function StepCaracteristicas({ register }: Props) {
  return (
    <FormSection
      title="Características"
      description="Dados comerciais e técnicos do empreendimento."
    >
      <div className="grid gap-6 md:grid-cols-2">

        <TextField
          label="Tipo (ex: Residencial, Comercial)"
          {...register("tipo")}
        />

        <TextField
          label="Previsão de entrega"
          type="date"
          {...register("entrega")}
        />

        <TextField
          label="Registro (matrícula/incorporação)"
          {...register("registro")}
        />

        <TextField
          label="Área final (m²)"
          type="number"
          {...register("areaFinal")}
        />

        <TextField
          label="Valor inicial (R$)"
          type="number"
          {...register("valorInicial")}
        />

        <TextField
          label="Valor final (R$)"
          type="number"
          {...register("valorFinal")}
        />

        <TextField
          label="VGV (R$)"
          type="number"
          {...register("vgv")}
        />

      </div>

      <div className="mt-6">
        <label className="mb-2 block font-sans text-sm font-medium text-slate-600">
          Potencial de valorização e rentabilidade (texto editorial)
        </label>
        <textarea
          {...register("valorizacaoTexto")}
          rows={4}
          placeholder="Ex: Região com valorização média histórica de X% ao ano. Rentabilidade média de locação por temporada de X% ao ano..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />
      </div>
    </FormSection>
  );
}
