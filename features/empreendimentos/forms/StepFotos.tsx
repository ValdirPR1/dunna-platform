import FormSection from "@/components/ui/form/FormSection";
import GerenciadorFotos, {
  ItemFoto,
} from "@/features/imoveis/components/GerenciadorFotos";

interface Props {
  itens: ItemFoto[];
  capaKey: string | null;
  onAdicionar: (arquivos: FileList | null) => void;
  onSetCapa: (key: string) => void;
  onMover: (key: string, direcao: "esquerda" | "direita") => void;
  onRemover: (key: string) => void;
}

export default function StepFotos({
  itens,
  capaKey,
  onAdicionar,
  onSetCapa,
  onMover,
  onRemover,
}: Props) {
  return (
    <FormSection title="Fotos">
      <p className="mb-4 font-sans text-sm text-slate-500">
        Clique na estrela pra escolher a foto de capa, e use as
        setas pra reordenar.
      </p>

      <GerenciadorFotos
        itens={itens}
        capaKey={capaKey}
        onAdicionar={onAdicionar}
        onSetCapa={onSetCapa}
        onMover={onMover}
        onRemover={onRemover}
      />
    </FormSection>
  );
}
