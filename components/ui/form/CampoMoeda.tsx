"use client";

interface Props {
  value: string;
  onChange: (valorBruto: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CampoMoeda({
  value,
  onChange,
  placeholder,
  label,
}: Props) {
  const valorFormatado = value
    ? Number(value).toLocaleString("pt-BR")
    : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Guarda só os dígitos (sem pontuação), quem exibe formatado é o
    // toLocaleString acima — assim nunca desalinha, mesmo em números grandes
    const apenasDigitos = e.target.value.replace(/\D/g, "");
    onChange(apenasDigitos);
  }

  return (
    <div>

      {label && (
        <label className="mb-2 block font-sans text-sm font-medium text-slate-600">
          {label}
        </label>
      )}

      <div className="relative">

        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-sans text-slate-400">
          R$
        </span>

        <input
          type="text"
          inputMode="numeric"
          value={valorFormatado}
          onChange={handleChange}
          placeholder={placeholder ?? "0"}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 pl-11 font-sans text-navy outline-none focus:border-gold"
        />

      </div>

    </div>
  );
}
