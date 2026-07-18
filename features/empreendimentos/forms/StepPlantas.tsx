"use client";

import { Plus, Trash2, Upload, X } from "lucide-react";
import FormSection from "@/components/ui/form/FormSection";

export interface FotoExistente {
  id: string;
  url: string;
}

export interface FotoNova {
  key: string;
  file: File;
  url: string;
}

export interface ItemPlanta {
  key: string;
  tipologia: string;
  area: string;
  preco: string;
  fotosExistentes: FotoExistente[];
  fotosNovas: FotoNova[];
  fotosRemovidas: string[];
  existingId?: string;
}

interface Props {
  itens: ItemPlanta[];
  onChange: (itens: ItemPlanta[]) => void;
}

export default function StepPlantas({ itens, onChange }: Props) {
  function adicionarTipologia() {
    onChange([
      ...itens,
      {
        key: `nova-${Date.now()}`,
        tipologia: "",
        area: "",
        preco: "",
        fotosExistentes: [],
        fotosNovas: [],
        fotosRemovidas: [],
      },
    ]);
  }

  function atualizarCampo(
    key: string,
    campo: "tipologia" | "area" | "preco",
    valor: string
  ) {
    onChange(
      itens.map((item) =>
        item.key === key ? { ...item, [campo]: valor } : item
      )
    );
  }

  function adicionarFotos(key: string, arquivos: FileList | null) {
    if (!arquivos) return;

    const novas: FotoNova[] = Array.from(arquivos).map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    onChange(
      itens.map((item) =>
        item.key === key
          ? { ...item, fotosNovas: [...item.fotosNovas, ...novas] }
          : item
      )
    );
  }

  function removerFotoExistente(key: string, fotoId: string) {
    onChange(
      itens.map((item) =>
        item.key === key
          ? {
              ...item,
              fotosExistentes: item.fotosExistentes.filter(
                (f) => f.id !== fotoId
              ),
              fotosRemovidas: [...item.fotosRemovidas, fotoId],
            }
          : item
      )
    );
  }

  function removerFotoNova(key: string, fotoKey: string) {
    onChange(
      itens.map((item) =>
        item.key === key
          ? {
              ...item,
              fotosNovas: item.fotosNovas.filter((f) => f.key !== fotoKey),
            }
          : item
      )
    );
  }

  function removerTipologia(key: string) {
    onChange(itens.filter((item) => item.key !== key));
  }

  return (
    <FormSection
      title="Tipologias e Plantas"
      description="Cadastre ou edite cada tipologia, com a planta baixa e fotos da unidade decorada correspondente (ex: fotos do Studio decorado junto com a planta do Studio)."
    >
      <div className="space-y-6">

        {itens.map((item) => {
          const totalFotos =
            item.fotosExistentes.length + item.fotosNovas.length;

          return (
            <div
              key={item.key}
              className="rounded-2xl border border-slate-200 p-6"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="grid flex-1 gap-4 md:grid-cols-3">

                  <input
                    value={item.tipologia}
                    onChange={(e) =>
                      atualizarCampo(item.key, "tipologia", e.target.value)
                    }
                    placeholder="Tipologia (ex: Studio, 2 Quartos)"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
                  />

                  <input
                    value={item.area}
                    onChange={(e) =>
                      atualizarCampo(item.key, "area", e.target.value)
                    }
                    placeholder="Área (m²)"
                    type="number"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
                  />

                  <input
                    value={item.preco}
                    onChange={(e) =>
                      atualizarCampo(item.key, "preco", e.target.value)
                    }
                    placeholder="Valor a partir de (R$)"
                    type="number"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
                  />

                </div>

                <button
                  type="button"
                  onClick={() => removerTipologia(item.key)}
                  className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Remover tipologia"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <div className="mt-4 flex flex-wrap gap-3">

                {item.fotosExistentes.map((foto, index) => (
                  <div key={foto.id} className="relative">

                    <img
                      src={foto.url}
                      alt={item.tipologia}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removerFotoExistente(item.key, foto.id)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                    >
                      <X size={12} className="text-slate-600" />
                    </button>

                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Capa
                      </span>
                    )}

                  </div>
                ))}

                {item.fotosNovas.map((foto, index) => (
                  <div key={foto.key} className="relative">

                    <img
                      src={foto.url}
                      alt={item.tipologia}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removerFotoNova(item.key, foto.key)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                    >
                      <X size={12} className="text-slate-600" />
                    </button>

                    {item.fotosExistentes.length === 0 && index === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Capa
                      </span>
                    )}

                  </div>
                ))}

                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-gold hover:text-gold">
                  <Upload size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => adicionarFotos(item.key, e.target.files)}
                  />
                </label>

              </div>

              {totalFotos === 0 && (
                <p className="mt-2 font-sans text-xs text-amber-600">
                  Adicione pelo menos uma foto pra essa tipologia aparecer
                  no site.
                </p>
              )}

            </div>
          );
        })}

      </div>

      <button
        type="button"
        onClick={adicionarTipologia}
        className="mt-6 flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-sans font-semibold text-white transition hover:bg-navy/90"
      >
        <Plus size={18} />
        Adicionar tipologia
      </button>

    </FormSection>
  );
}
