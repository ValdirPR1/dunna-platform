"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { ClienteCrm, TarefaCrm } from "../types";
import { alternarTarefa, excluirTarefa } from "../services/meucrm.service";
import { formatarDataHora, mesmoDia } from "../utils";

interface Props {
  tarefas: TarefaCrm[];
  clientes: ClienteCrm[];
  onNova: () => void;
  onEditar: (t: TarefaCrm) => void;
  onMudou: () => void;
}

export default function ListaTarefas({ tarefas, clientes, onNova, onEditar, onMudou }: Props) {
  const agora = Date.now();
  const hoje = new Date();
  const nomeCliente = (id: string | null) => clientes.find((c) => c.id === id)?.nome;

  const abertas = tarefas.filter((t) => !t.concluida);
  const atrasadas = abertas.filter((t) => new Date(t.data_hora).getTime() < agora);
  const doDia = abertas.filter((t) => new Date(t.data_hora).getTime() >= agora && mesmoDia(new Date(t.data_hora), hoje));
  const proximas = abertas.filter((t) => new Date(t.data_hora).getTime() >= agora && !mesmoDia(new Date(t.data_hora), hoje));
  const concluidas = tarefas
    .filter((t) => t.concluida)
    .sort((a, b) => (b.concluida_em ?? "").localeCompare(a.concluida_em ?? ""))
    .slice(0, 10);

  async function marcar(t: TarefaCrm, valor: boolean) {
    try {
      await alternarTarefa(t.id, valor);
      onMudou();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível atualizar.");
    }
  }

  async function remover(t: TarefaCrm) {
    if (!confirm("Excluir esta tarefa?")) return;
    try {
      await excluirTarefa(t.id);
      onMudou();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível excluir.");
    }
  }

  function grupo(titulo: string, lista: TarefaCrm[], cor?: string) {
    if (lista.length === 0) return null;
    return (
      <div key={titulo} className="mt-6">
        <h3 className={`font-sans text-sm font-semibold uppercase tracking-wider ${cor ?? "text-slate-500"}`}>
          {titulo} ({lista.length})
        </h3>
        <ul className="mt-3 space-y-2">
          {lista.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <input
                type="checkbox"
                checked={t.concluida}
                onChange={(e) => marcar(t, e.target.checked)}
                className="h-5 w-5 shrink-0 accent-gold"
              />
              <div className="min-w-0 flex-1">
                <p className={`truncate font-sans font-medium ${t.concluida ? "text-slate-400 line-through" : "text-navy"}`}>{t.titulo}</p>
                <p className="font-sans text-xs text-slate-400">
                  {formatarDataHora(t.data_hora)}
                  {nomeCliente(t.cliente_id) ? ` · ${nomeCliente(t.cliente_id)}` : ""}
                </p>
              </div>
              <button onClick={() => onEditar(t)} aria-label="Editar" className="text-slate-400 hover:text-navy"><Pencil size={16} /></button>
              <button onClick={() => remover(t)} aria-label="Excluir" className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={onNova} className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white hover:bg-gold-dark">
          <Plus size={18} /> Nova tarefa
        </button>
      </div>

      {tarefas.length === 0 && (
        <p className="mt-10 text-center font-sans text-slate-400">Nenhuma tarefa ainda.</p>
      )}

      {grupo("Atrasadas", atrasadas, "text-red-600")}
      {grupo("Hoje", doDia, "text-gold-dark")}
      {grupo("Próximas", proximas)}
      {grupo("Concluídas recentemente", concluidas)}
    </div>
  );
}
