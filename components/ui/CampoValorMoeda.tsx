"use client";

interface Props {
  value: string; // dígitos puros (reais inteiros), ex: "460000"
  onChange: (novoValor: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

// Campo de valor em reais que só aceita dígitos — evita o erro clássico
// de digitar "460.000" (querendo dizer 460 mil) num <input type="number">
// e o sistema salvar 460, porque o "." vira separador decimal. Aqui o
// usuário só digita números; a formatação com pontos de milhar é só
// visual, o valor guardado é sempre em reais inteiros.
export default function CampoValorMoeda({
  value,
  onChange,
  placeholder = "0",
  autoFocus,
  className,
}: Props) {
  function aoDigitar(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value.replace(/\D/g, ""));
  }

  const exibicao = value ? Number(value).toLocaleString("pt-BR") : "";

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-sans text-slate-400">
        R$
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={exibicao}
        onChange={aoDigitar}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={
          className ??
          "w-full rounded-xl border border-slate-200 p-3 pl-10 font-sans outline-none focus:border-gold"
        }
      />
    </div>
  );
}
