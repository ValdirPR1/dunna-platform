import { Star } from "lucide-react";

interface Props {
  nota: number;
  tamanho?: number;
}

export default function Estrelas({ nota, tamanho = 16 }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={tamanho}
          className={
            i < Math.round(nota)
              ? "fill-gold text-gold"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
}
