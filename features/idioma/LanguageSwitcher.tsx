"use client";

import { IDIOMAS } from "./dicionario";
import { useIdioma } from "./IdiomaContext";

// Seletor PT/EN/ES do site público. Fica no cabeçalho, sempre visível
// — a troca é só visual (localStorage), não muda a URL nem recarrega
// a página.
export default function LanguageSwitcher({
  className = "",
  claro = false,
}: {
  className?: string;
  // Versão pra fundo escuro/foto (cabeçalho transparente da home)
  claro?: boolean;
}) {
  const { idioma, definirIdioma } = useIdioma();

  return (
    <div
      className={`flex items-center gap-1 rounded-full border p-1 ${
        claro ? "border-white/30" : "border-slate-200"
      } ${className}`}
      role="group"
      aria-label="Selecionar idioma"
    >
      {IDIOMAS.map((opcao) => (
        <button
          key={opcao.codigo}
          type="button"
          onClick={() => definirIdioma(opcao.codigo)}
          aria-pressed={idioma === opcao.codigo}
          className={`rounded-full px-2.5 py-1 font-sans text-xs font-semibold transition ${
            idioma === opcao.codigo
              ? "bg-gold text-white"
              : claro
                ? "text-white/85 hover:bg-white/10"
                : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {opcao.bandeira} {opcao.label}
        </button>
      ))}
    </div>
  );
}
