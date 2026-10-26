"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarPlus, MessageCircle, Pencil, Trash2, X } from "lucide-react";
import { ClienteCrm, ETAPAS, NotaCrm, TarefaCrm } from "../types";
import {
  adicionarNota,
  alternarTarefa,
  arquivarCliente,
  excluirNota,
  listarNotas,
  mudarEtapa,
} from "../services/meucrm.service";
import { formatarDataHora, formatarMoeda, inputClass, linkWhatsapp } from "../utils";

interface Props {
  cliente: ClienteCrm | null;
  tarefas: TarefaCrm[];
  onFechar: () => void;
  onEditar: (c: ClienteCrm) => void;
  onNovaTarefa: (c: ClienteCrm) => void;
  onMudou: () => void;
}

export default function ClienteDetalhe({
  cliente,
  tarefas,
  onFechar,
  onEditar,
  onNovaTarefa,
  onMudou,
}: Props) {
  const [notas, setNotas] = useState<NotaCrm[]>([]);
  const [novaNota, setNovaNota] = useState("");

  const carregarNotas = useCallback(async () => {
    if (!cliente) return;
    try {
      setNotas(await listarNotas(cliente.id));
    } catch (e) {
      console.error(e);
    }
  }, [cliente]);

  useEffect(() => {
    carregarNotas();
  }, [carregarNotas]);

  if (!cliente) return null;

  const zap = linkWhatsapp(cliente.telefone);
  const tarefasDoCliente = tarefas.filter((t) => t.cliente_id === cliente.id);

  async function trocarEtapa(etapa: string) {
    try {
      await mudarEtapa(cliente!.id, etapa);
      toast.success(`Movido para "${etapa}"`);
      onMudou();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível mudar a etapa.");
    }
  }

  async function addNota() {
    if (!novaNota.trim()) return;
    try {
      await adicionarNota(cliente!.id, novaNota.trim());
      setNovaNota("");
      await carregarNotas();
      onMudou();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar a anotação.");
    }
  }

  async function remover() {
    if (!confirm(`Remover "${cliente!.nome}" da sua lista?`)) return;
    try {
      await arquivarCliente(cliente!.id);
      toast.success("Cliente removido.");
      onMudou();
      onFechar();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível remover.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-8 shadow-2xl">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">{cliente.nome}</h2>
            <p className="mt-1 font-sans text-sm text-slate-500">
              {cliente.origem}
              {cliente.valor_estimado ? ` · ${formatarMoeda(cliente.valor_estimado)}` : ""}
            </p>
          </div>
          <button onClick={onFechar} aria-label="Fechar" className="text-slate-400 hover:text-slate-600">
            <X size={22} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {zap && (
            <a href={zap} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 font-sans text-sm font-semibold text-white hover:brightness-105">
              <MessageCircle size={16} /> WhatsApp
            </a>
          )}
          <button onClick={() => onNovaTarefa(cliente)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-sans text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <CalendarPlus size={16} /> Agendar tarefa
          </button>
          <button onClick={() => onEditar(cliente)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-sans text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Pencil size={16} /> Editar
          </button>
          <button onClick={remover} className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 font-sans text-sm font-semibold text-red-600 hover:bg-red-50">
            <Trash2 size={16} /> Remover
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-sans text-sm font-medium text-slate-600">Etapa</label>
          <select value={cliente.etapa} onChange={(e) => trocarEtapa(e.target.value)} className={inputClass}>
            {ETAPAS.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>

        <dl className="mt-6 space-y-2 font-sans text-sm text-slate-600">
          {cliente.telefone && <div><dt className="inline font-semibold text-navy">Telefone: </dt><dd className="inline">{cliente.telefone}</dd></div>}
          {cliente.email && <div><dt className="inline font-semibold text-navy">E-mail: </dt><dd className="inline">{cliente.email}</dd></div>}
          {cliente.interesse && <div><dt className="inline font-semibold text-navy">Interesse: </dt><dd className="inline">{cliente.interesse}</dd></div>}
          {cliente.observacoes && <div><dt className="font-semibold text-navy">Observações</dt><dd className="mt-1 whitespace-pre-line">{cliente.observacoes}</dd></div>}
        </dl>

        {/* Tarefas do cliente */}

        <h3 className="mt-8 font-sans font-semibold text-navy">Tarefas</h3>
        <ul className="mt-3 space-y-2">
          {tarefasDoCliente.length === 0 && <li className="font-sans text-sm text-slate-400">Nenhuma tarefa para este cliente.</li>}
          {tarefasDoCliente.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input
                type="checkbox"
                checked={t.concluida}
                onChange={async (e) => {
                  await alternarTarefa(t.id, e.target.checked);
                  onMudou();
                }}
                className="h-5 w-5 accent-gold"
              />
              <div className="min-w-0">
                <p className={`truncate font-sans text-sm ${t.concluida ? "text-slate-400 line-through" : "text-navy"}`}>{t.titulo}</p>
                <p className="font-sans text-xs text-slate-400">{formatarDataHora(t.data_hora)}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Anotações */}

        <h3 className="mt-8 font-sans font-semibold text-navy">Anotações</h3>
        <div className="mt-3 flex gap-2">
          <input
            value={novaNota}
            onChange={(e) => setNovaNota(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNota()}
            placeholder="Registrar uma conversa, retorno, detalhe..."
            className={inputClass}
          />
          <button onClick={addNota} className="shrink-0 rounded-xl bg-navy px-5 font-sans text-sm font-semibold text-white hover:opacity-90">
            Salvar
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {notas.map((n) => (
            <li key={n.id} className="rounded-xl bg-slate-50 p-4">
              <p className="whitespace-pre-line font-sans text-sm text-slate-700">{n.texto}</p>
              <div className="mt-2 flex items-center justify-between font-sans text-xs text-slate-400">
                {formatarDataHora(n.criado_em)}
                <button
                  onClick={async () => {
                    await excluirNota(n.id);
                    carregarNotas();
                  }}
                  aria-label="Excluir anotação"
                  className="hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
