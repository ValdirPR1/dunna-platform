"use client";

import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import FormSection from "@/components/ui/form/FormSection";

export interface ItemPlanta {
  key: string;
  tipologia: string;
  area: string;
  preco: string;
  url: string;
  file?: File;
  existingId?: string;
}

interface Props {
  itens: ItemPlanta[];
  onAdicionar: (item: ItemPlanta) => void;
  onRemover: (key: string) => void;
}

export default function StepPlantas({ itens, onAdicionar, onRemover }: Props) {
  const [tipologia, setTipologia] = useState("");
  const [area, setArea] = useState("");
  const [preco, setPreco] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  function handleAdicionar() {
    if (!tipologia || !arquivo) return;

    onAdicionar({
      key: `${arquivo.name}-${Date.now()}`,
      tipologia,
      area,
      preco,
      url: URL.createObjectURL(arquivo),
      file: arquivo,
    });

    setTipologia("");
    setArea("");
    setPreco("");
    setArquivo(null);
  }

  return (
    <FormSection
      title="Tipologias e Plantas"
      description="Cadastre cada planta disponível, com metragem e valor inicial."
    >
      <div className="rounded-2xl border border-slate-200 p-6">

        <div className="grid gap-4 md:grid-cols-3">

          <input
            value={tipologia}
            onChange={(e) => setTipologia(e.target.value)}
            placeholder="Tipologia (ex: 2 Quartos)"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Área (m²)"
            type="number"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Valor a partir de (R$)"
            type="number"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

        </div>

        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 font-sans text-sm text-slate-500 transition hover:border-gold hover:text-gold">
          <Upload size={18} />
          {arquivo ? arquivo.name : "Escolher imagem da planta"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          />
        </label>

        <button
          type="button"
          onClick={handleAdicionar}
          disabled={!tipologia || !arquivo}
          className="mt-4 flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-sans font-semibold text-white transition hover:bg-navy/90 disabled:opacity-40"
        >
          <Plus size={18} />
          Adicionar planta
        </button>

      </div>

      {itens.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">

          {itens.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
            >

              <img
                src={item.url}
                alt={item.tipologia}
                className="h-20 w-20 rounded-xl object-cover"
              />

              <div className="flex-1">
                <p className="font-sans font-semibold text-navy">
                  {item.tipologia}
                </p>
                <p className="font-sans text-sm text-slate-500">
                  {item.area ? `${item.area}m²` : ""}
                  {item.preco
                    ? ` • a partir de R$ ${Number(item.preco).toLocaleString("pt-BR")}`
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemover(item.key)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}

        </div>
      )}

    </FormSection>
  );
}
