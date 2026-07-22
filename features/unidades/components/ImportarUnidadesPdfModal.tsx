"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, X, Plus, Trash2, FileText } from "lucide-react";
import { lerTabelaDePrecos, LinhaUnidade } from "@/lib/lerTabelaPdf";
import { criarUnidade } from "../services/unidade.service";

interface LinhaEditavel extends LinhaUnidade {
  key: string;
  incluir: boolean;
}

interface Props {
  aberto: boolean;
  empreendimentoId: string;
  onFechar: () => void;
  onImportado: () => void;
}

export default function ImportarUnidadesPdfModal({
  aberto,
  empreendimentoId,
  onFechar,
  onImportado,
}: Props) {
  const [processando, setProcessando] = useState(false);
  const [importando, setImportando] = useState(false);
  const [linhas, setLinhas] = useState<LinhaEditavel[]>([]);
  const [textoBruto, setTextoBruto] = useState("");
  const [mostrarTextoBruto, setMostrarTextoBruto] = useState(false);

  if (!aberto) return null;

  async function escolherArquivo(file: File | null) {
    if (!file) return;

    setProcessando(true);
    setLinhas([]);

    try {
      const resultado = await lerTabelaDePrecos(file);

      setTextoBruto(resultado.textoBruto);

      if (resultado.linhas.length === 0) {
        toast.error(
          "Não consegui identificar nenhuma linha automaticamente. Você pode conferir o texto bruto abaixo e adicionar as unidades manualmente."
        );
        setMostrarTextoBruto(true);
      } else {
        toast.success(
          `${resultado.linhas.length} unidade(s) identificada(s)! Confere antes de importar.`
        );
      }

      setLinhas(
        resultado.linhas.map((l, i) => ({
          ...l,
          key: `${i}-${Date.now()}`,
          incluir: true,
        }))
      );
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível ler esse PDF.");
    } finally {
      setProcessando(false);
    }
  }

  function atualizarLinha(
    key: string,
    campo: "unidade" | "torre" | "area" | "valor",
    valor: string
  ) {
    setLinhas((prev) =>
      prev.map((l) => (l.key === key ? { ...l, [campo]: valor } : l))
    );
  }

  function alternarIncluir(key: string) {
    setLinhas((prev) =>
      prev.map((l) => (l.key === key ? { ...l, incluir: !l.incluir } : l))
    );
  }

  function removerLinha(key: string) {
    setLinhas((prev) => prev.filter((l) => l.key !== key));
  }

  function adicionarLinhaManual() {
    setLinhas((prev) => [
      ...prev,
      { key: `manual-${Date.now()}`, unidade: "", torre: "", area: "", valor: "", incluir: true },
    ]);
  }

  async function importar() {
    const selecionadas = linhas.filter(
      (l) => l.incluir && l.unidade && l.valor
    );

    if (selecionadas.length === 0) {
      toast.error("Marque pelo menos uma linha válida pra importar.");
      return;
    }

    setImportando(true);

    let sucesso = 0;
    let falhas = 0;

    for (const linha of selecionadas) {
      try {
        await criarUnidade({
          empreendimento_id: empreendimentoId,
          torre: linha.torre,
          bloco: "",
          andar: "",
          numero: linha.unidade,
          tipologia: "",
          quartos: "",
          suites: "",
          vagas: "",
          area: linha.area,
          preco: linha.valor,
          comissao: "",
          status: "Disponível",
          corretor_id: "",
        });
        sucesso++;
      } catch (e) {
        console.error("Erro ao importar unidade", linha, e);
        falhas++;
      }
    }

    setImportando(false);

    if (sucesso > 0) {
      toast.success(`${sucesso} unidade(s) importada(s) com sucesso!`);
      onImportado();
      fechar();
    }

    if (falhas > 0) {
      toast.error(`${falhas} linha(s) não puderam ser importadas.`);
    }
  }

  function fechar() {
    setLinhas([]);
    setTextoBruto("");
    setMostrarTextoBruto(false);
    onFechar();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={fechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl"
      >

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">
            Importar Tabela de Preços (PDF)
          </h2>
          <button onClick={fechar}>
            <X size={20} className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {linhas.length === 0 && (
          <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-10 font-sans text-sm text-slate-500 transition hover:border-gold hover:text-gold">
            <Upload size={24} />
            {processando ? "Lendo o PDF..." : "Clique para escolher o PDF"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={processando}
              onChange={(e) => escolherArquivo(e.target.files?.[0] ?? null)}
            />
          </label>
        )}

        {linhas.length > 0 && (
          <>
            <p className="mt-5 mb-3 font-sans text-sm text-slate-500">
              Confere cada linha antes de importar. Desmarca ou edita o
              que precisar, e remove o que não for uma unidade de
              verdade.
            </p>

            <div className="space-y-2">

              <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-2 px-2 font-sans text-xs font-semibold uppercase text-slate-400">
                <span></span>
                <span>Unidade</span>
                <span>Torre/Bloco</span>
                <span>Área (m²)</span>
                <span>Valor (R$)</span>
                <span></span>
              </div>

              {linhas.map((linha) => (
                <div
                  key={linha.key}
                  className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2"
                >
                  <input
                    type="checkbox"
                    checked={linha.incluir}
                    onChange={() => alternarIncluir(linha.key)}
                    className="h-5 w-5 accent-gold"
                  />
                  <input
                    value={linha.unidade}
                    onChange={(e) =>
                      atualizarLinha(linha.key, "unidade", e.target.value)
                    }
                    className="rounded-lg border border-slate-200 bg-white p-2 font-sans text-sm text-navy outline-none focus:border-gold"
                  />
                  <input
                    value={linha.torre}
                    onChange={(e) =>
                      atualizarLinha(linha.key, "torre", e.target.value)
                    }
                    placeholder="Ex: Torre A"
                    className="rounded-lg border border-slate-200 bg-white p-2 font-sans text-sm text-navy outline-none focus:border-gold"
                  />
                  <input
                    value={linha.area}
                    onChange={(e) =>
                      atualizarLinha(linha.key, "area", e.target.value)
                    }
                    className="rounded-lg border border-slate-200 bg-white p-2 font-sans text-sm text-navy outline-none focus:border-gold"
                  />
                  <input
                    value={linha.valor}
                    onChange={(e) =>
                      atualizarLinha(linha.key, "valor", e.target.value)
                    }
                    className="rounded-lg border border-slate-200 bg-white p-2 font-sans text-sm text-navy outline-none focus:border-gold"
                  />
                  <button
                    onClick={() => removerLinha(linha.key)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

            </div>

            <button
              onClick={adicionarLinhaManual}
              className="mt-3 flex items-center gap-2 font-sans text-sm font-semibold text-gold"
            >
              <Plus size={15} />
              Adicionar linha manual
            </button>

            <button
              onClick={() => setMostrarTextoBruto((v) => !v)}
              className="mt-4 flex items-center gap-2 font-sans text-xs text-slate-400 hover:text-slate-600"
            >
              <FileText size={13} />
              {mostrarTextoBruto ? "Esconder" : "Ver"} texto bruto extraído do PDF
            </button>

            {mostrarTextoBruto && (
              <pre className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300">
                {textoBruto}
              </pre>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={fechar}
                className="flex-1 rounded-xl border border-slate-300 py-3 font-sans font-semibold text-navy hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={importar}
                disabled={importando}
                className="flex-1 rounded-xl bg-navy py-3 font-sans font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
              >
                {importando
                  ? "Importando..."
                  : `Importar ${linhas.filter((l) => l.incluir).length} Unidade(s)`}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
