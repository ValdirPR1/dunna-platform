"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import FormSection from "@/components/ui/form/FormSection";
import { COMODIDADES_PADRAO } from "../constants/comodidades";
import { iconeDaComodidade } from "../constants/iconesComodidades";

interface Props {
  selecionadas: string[];
  onChange: (novaLista: string[]) => void;
}

export default function StepComodidades({ selecionadas, onChange }: Props) {
  const [novoItem, setNovoItem] = useState("");

  function alternar(item: string) {
    if (selecionadas.includes(item)) {
      onChange(selecionadas.filter((i) => i !== item));
    } else {
      onChange([...selecionadas, item]);
    }
  }

  function adicionarPersonalizado() {
    const valor = novoItem.trim();
    if (!valor || selecionadas.includes(valor)) return;
    onChange([...selecionadas, valor]);
    setNovoItem("");
  }

  // Itens personalizados são os que a pessoa adicionou e não estão na lista padrão
  const personalizados = selecionadas.filter(
    (item) => !COMODIDADES_PADRAO.includes(item as any)
  );

  return (
    <FormSection
      title="Lazer e Conveniência"
      description="Marque tudo que o empreendimento oferece. Você também pode adicionar itens que não estão na lista."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

        {COMODIDADES_PADRAO.map((item) => {
          const Icone = iconeDaComodidade(item);
          const ativo = selecionadas.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => alternar(item)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left font-sans text-sm font-medium transition ${
                ativo
                  ? "border-gold bg-gold/10 text-navy"
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <Icone
                size={18}
                className={ativo ? "text-gold" : "text-slate-400"}
              />
              {item}
            </button>
          );
        })}

      </div>

      {personalizados.length > 0 && (
        <div className="mt-6">

          <p className="mb-3 font-sans text-sm font-semibold text-slate-500">
            Itens adicionados manualmente
          </p>

          <div className="flex flex-wrap gap-2">

            {personalizados.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 font-sans text-sm text-navy"
              >
                {item}
                <button
                  type="button"
                  onClick={() => alternar(item)}
                  aria-label="Remover"
                >
                  <X size={14} className="text-slate-400 hover:text-red-500" />
                </button>
              </span>
            ))}

          </div>

        </div>
      )}

      <div className="mt-6 flex gap-3">

        <input
          value={novoItem}
          onChange={(e) => setNovoItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionarPersonalizado();
            }
          }}
          placeholder="Não achou o item? Digite aqui e adicione"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
        />

        <button
          type="button"
          onClick={adicionarPersonalizado}
          className="flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-sans font-semibold text-white transition hover:bg-navy/90"
        >
          <Plus size={18} />
          Adicionar
        </button>

      </div>

    </FormSection>
  );
}
