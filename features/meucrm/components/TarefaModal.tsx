"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { ClienteCrm, TarefaCrm } from "../types";
import { salvarTarefa } from "../services/meucrm.service";
import { datetimeLocalAgora, inputClass, labelClass, paraDatetimeLocal } from "../utils";

interface Props {
  aberto: boolean;
  tarefa?: TarefaCrm | null;
  clientes: ClienteCrm[];
  clientePadraoId?: string | null;
  dataInicial?: Date | null;
  onFechar: () => void;
  onSalvo: () => void;
}

export default function TarefaModal({
  aberto,
  tarefa,
  clientes,
  clientePadraoId,
  dataInicial,
  onFechar,
  onSalvo,
}: Props) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao ?? "");
      setDataHora(paraDatetimeLocal(tarefa.data_hora));
      setClienteId(tarefa.cliente_id ?? "");
    } else {
      setTitulo("");
      setDescricao("");
      setClienteId(clientePadraoId ?? "");
      if (dataInicial) {
        const d = new Date(dataInicial);
        d.setHours(9, 0, 0, 0);
        setDataHora(paraDatetimeLocal(d.toISOString()));
      } else {
        setDataHora(datetimeLocalAgora(60));
      }
    }
  }, [aberto, tarefa, clientePadraoId, dataInicial]);

  if (!aberto) return null;

  async function salvar() {
    if (!titulo.trim() || !dataHora) {
      toast.error("Informe o título e o horário.");
      return;
    }
    setSalvando(true);
    try {
      await salvarTarefa(
        {
          titulo: titulo.trim(),
          descricao,
          data_hora: new Date(dataHora).toISOString(),
          cliente_id: clienteId || null,
        },
        tarefa?.id
      );
      toast.success("Tarefa salva!");
      onSalvo();
      onFechar();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar a tarefa.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">
            {tarefa ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <button onClick={onFechar} aria-label="Fechar" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className={labelClass}>O que fazer *</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Ligar para retornar proposta" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Data e hora *</label>
            <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Cliente (opcional)</label>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} className={inputClass}>
              <option value="">Sem cliente</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Detalhes</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className={inputClass} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onFechar} className="rounded-xl border border-slate-200 px-6 py-3 font-sans font-semibold text-slate-600 hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={salvar} disabled={salvando} className="rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white hover:bg-gold-dark disabled:opacity-60">
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>

      </div>
    </div>
  );
}
