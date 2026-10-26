"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ClienteCrm, TarefaCrm } from "../types";
import { formatarHora, mesmoDia } from "../utils";

interface Props {
  tarefas: TarefaCrm[];
  clientes: ClienteCrm[];
  onNovaNoDia: (d: Date) => void;
  onEditar: (t: TarefaCrm) => void;
}

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function AgendaMes({ tarefas, clientes, onNovaNoDia, onEditar }: Props) {
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selecionado, setSelecionado] = useState(new Date());

  const primeiroDia = mes.getDay();
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const celulas: (Date | null)[] = [
    ...Array.from({ length: primeiroDia }, () => null),
    ...Array.from({ length: diasNoMes }, (_, i) => new Date(mes.getFullYear(), mes.getMonth(), i + 1)),
  ];

  const tarefasDoDia = (d: Date) => tarefas.filter((t) => mesmoDia(new Date(t.data_hora), d));
  const doSelecionado = tarefasDoDia(selecionado);
  const nomeCliente = (id: string | null) => clientes.find((c) => c.id === id)?.nome;
  const hoje = new Date();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))} aria-label="Mês anterior" className="rounded-lg p-2 hover:bg-slate-100"><ChevronLeft size={18} /></button>
          <h3 className="font-display text-lg font-bold capitalize text-navy">
            {mes.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </h3>
          <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))} aria-label="Próximo mês" className="rounded-lg p-2 hover:bg-slate-100"><ChevronRight size={18} /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs font-semibold text-slate-400">
          {DIAS.map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {celulas.map((d, i) => {
            if (!d) return <div key={i} />;
            const lista = tarefasDoDia(d);
            const abertas = lista.filter((t) => !t.concluida).length;
            const atrasado = lista.some((t) => !t.concluida && new Date(t.data_hora).getTime() < Date.now());
            const ativo = mesmoDia(d, selecionado);
            return (
              <button
                key={i}
                onClick={() => setSelecionado(d)}
                className={`flex h-16 flex-col items-center justify-start rounded-xl border p-1.5 font-sans text-sm transition ${
                  ativo ? "border-gold bg-gold/10" : "border-transparent hover:bg-slate-50"
                } ${mesmoDia(d, hoje) ? "font-bold text-gold-dark" : "text-slate-700"}`}
              >
                {d.getDate()}
                {lista.length > 0 && (
                  <span className={`mt-1 rounded-full px-1.5 text-[10px] font-semibold text-white ${atrasado ? "bg-red-500" : abertas > 0 ? "bg-gold" : "bg-slate-300"}`}>
                    {lista.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center justify-between">
          <h3 className="font-sans font-semibold capitalize text-navy">
            {selecionado.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          <button onClick={() => onNovaNoDia(selecionado)} aria-label="Nova tarefa neste dia" className="rounded-lg bg-gold p-2 text-white hover:bg-gold-dark">
            <Plus size={16} />
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {doSelecionado.length === 0 && <li className="font-sans text-sm text-slate-400">Nada agendado neste dia.</li>}
          {doSelecionado.map((t) => (
            <li key={t.id}>
              <button onClick={() => onEditar(t)} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50">
                <p className={`font-sans text-sm font-medium ${t.concluida ? "text-slate-400 line-through" : "text-navy"}`}>{t.titulo}</p>
                <p className="font-sans text-xs text-slate-400">
                  {formatarHora(t.data_hora)}
                  {nomeCliente(t.cliente_id) ? ` · ${nomeCliente(t.cliente_id)}` : ""}
                </p>
              </button>
            </li>
          ))}
        </ul>

      </div>

    </div>
  );
}
