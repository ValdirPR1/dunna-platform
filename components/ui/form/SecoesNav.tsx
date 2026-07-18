"use client";

interface Secao {
  id: string;
  label: string;
}

interface Props {
  secoes: Secao[];
}

export default function SecoesNav({ secoes }: Props) {
  function irPara(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-2 flex flex-wrap gap-2 bg-slate-100/95 px-4 py-3 backdrop-blur">

      {secoes.map((secao) => (
        <button
          key={secao.id}
          type="button"
          onClick={() => irPara(secao.id)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 font-sans text-sm font-medium text-slate-600 transition hover:border-gold hover:text-gold"
        >
          {secao.label}
        </button>
      ))}

    </div>
  );
}
