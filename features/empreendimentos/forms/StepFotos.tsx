import FormSection from "@/components/ui/form/FormSection";

export default function StepFotos() {
  return (
    <FormSection title="Fotos">
      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300">
        Arraste as imagens aqui
      </div>
    </FormSection>
  );
}