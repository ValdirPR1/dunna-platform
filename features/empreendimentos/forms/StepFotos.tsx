import FormSection from "@/components/ui/form/FormSection";
import GerenciadorFotos, {
  ItemFoto,
} from "@/features/imoveis/components/GerenciadorFotos";

interface Props {
  itens: ItemFoto[];
  capaKey: string | null;
  onAdicionar: (arquivos: FileList | null) => void;
  onSetCapa: (key: string) => void;
  onReordenar: (novaOrdem: ItemFoto[]) => void;
  onRemover: (key: string) => void;
}

export default function StepFotos({
  itens,
  capaKey,
  onAdicionar,
  onSetCapa,
  onReordenar,
  onRemover,
}: Props) {
  return (
    <FormSection title="Fotos">
      <p className="mb-4 font-sans text-sm text-slate-500">
        Clique na estrela pra escolher a foto de capa, e arraste as
        fotos pra reordenar.
      </p>

      <GerenciadorFotos
        itens={itens}
        capaKey={capaKey}
        onAdicionar={onAdicionar}
        onSetCapa={onSetCapa}
        onReordenar={onReordenar}
        onRemover={onRemover}
      />
    </FormSection>
  );
}
