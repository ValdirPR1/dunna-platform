"use client";

import { UseFormRegister } from "react-hook-form";
import { EmpreendimentoFormData } from "./schema";

export default function StepPublicacao({
  register,
}: {
  register: UseFormRegister<EmpreendimentoFormData>;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border p-5">

      <input
        type="checkbox"
        {...register("publicado")}
      />

      <span>Publicar imediatamente no site</span>

    </label>
  );
}