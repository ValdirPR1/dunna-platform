"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Phone,
  MessageCircle,
  MapPin,
  Users,
  CalendarDays,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import {
  excluirTarefa,
  listarTarefas,
  marcarConcluida,
} from "../services/tarefas.service";
import { Tarefa, TipoTarefa } from "../types/tarefa";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import NovaTarefaModal from "../components/NovaTarefaModal";
import ConexaoGoogleAgenda from "../components/ConexaoGoogleAgenda";
import { useAuth } from "@/features/core/auth/useAuth";

const iconesPorTipo: Record<TipoTarefa, any> = {
  "Ligação": Phone,
  "WhatsApp": MessageCircle,
  "Visita": MapPin,
  "Reunião": Users,
  "Outro": CalendarDays,
};

function chaveDoDia(data: string) {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
}

function rotuloDoDia(chave: string) {
  const hoje = new Date().toLocaleDateString("pt-BR");

  const amanhaData = new Date();
  amanhaData.setDate(amanhaData.getDate() + 1);
  const amanha = amanhaData.toLocaleDateString("pt-BR");

  if (chave === hoje) return "Hoje";
  if (chave === amanha) return "Amanhã";
  return chave;
}

export default function AgendaPage() {
  const { usuario } = useAuth();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [corretorSelecionado, setCorretorSelecionado] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Tarefa | null>(null);

  async function carregar(corretorId?: string) {
    setLoading(true);
    try {
      const dados = await listarTarefas(corretorId || undefined);
      setTarefas(dados);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarCorretoresAtivos().then(setCorretores).catch(() => {});
    carregar();
  }, []);

  function trocarCorretor(id: string) {
    setCorretorSelecionado(id);
    carregar(id);
  }

  async function handleConcluir(tarefa: Tarefa) {
    try {
      await marcarConcluida(tarefa.id, !tarefa.concluida);
      carregar(corretorSelecionado);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar a tarefa.");
    }
  }

  async function handleExcluir(tarefa: Tarefa) {
    const confirmado = window.confirm(
      `Excluir a tarefa "${tarefa.titulo}"?`
    );
    if (!confirmado) return;

    try {
      await excluirTarefa(tarefa.id);
      toast.success("Tarefa excluída.");
      carregar(corretorSelecionado);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir a tarefa.");
    }
  }

  const grupos = tarefas.reduce((acc: Record<string, Tarefa[]>, tarefa) => {
    const chave = chaveDoDia(tarefa.data_hora);
    if (!acc[chave]) acc[chave] = [];
    acc[chave].push(tarefa);
    return acc;
  }, {});

  return (
    <div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>

          <h1 className="font-display text-3xl font-bold text-navy">
            Agenda
          </h1>

          <p className="mt-2 font-sans text-slate-500">
            Suas tarefas e compromissos, organizados por dia.
          </p>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

          {usuario?.corretor_id && (
            <ConexaoGoogleAgenda corretorId={usuario.corretor_id} />
          )}

          <select
            value={corretorSelecionado}
            onChange={(e) => trocarCorretor(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 font-sans text-navy outline-none focus:border-gold sm:w-auto"
          >
            <option value="">Ver agenda de: todos</option>
            {corretores.map((c) => (
              <option key={c.id} value={c.id}>
                Ver agenda de: {c.nome}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setEditando(null);
              setModalAberto(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark sm:w-auto"
          >
            <Plus size={18} />
            Nova Tarefa
          </button>

        </div>

      </div>

      <div className="mt-8 space-y-8">

        {loading ? (

          <p className="font-sans text-slate-400">Carregando...</p>

        ) : Object.keys(grupos).length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <p className="font-sans text-slate-500">
              Nenhuma tarefa cadastrada ainda.
            </p>
          </div>

        ) : (

          Object.entries(grupos).map(([chave, itens]) => (

            <div key={chave}>

              <h2 className="mb-4 font-display text-xl font-bold text-navy">
                {rotuloDoDia(chave)}
              </h2>

              <div className="space-y-3">

                {itens.map((tarefa) => {
                  const Icone = iconesPorTipo[tarefa.tipo] ?? CalendarDays;
                  const atrasada =
                    !tarefa.concluida &&
                    new Date(tarefa.data_hora) < new Date();

                  return (

                    <div
                      key={tarefa.id}
                      className={`flex items-center gap-4 rounded-2xl border p-5 shadow-sm ${
                        tarefa.concluida
                          ? "border-slate-100 bg-slate-50 opacity-60"
                          : atrasada
                          ? "border-red-200 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >

                      <button
                        onClick={() => handleConcluir(tarefa)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          tarefa.concluida
                            ? "border-gold bg-gold"
                            : "border-slate-300"
                        }`}
                        aria-label="Marcar como concluída"
                      />

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                        <Icone size={18} />
                      </div>

                      <div className="flex-1">

                        <p
                          className={`font-sans font-semibold text-navy ${
                            tarefa.concluida ? "line-through" : ""
                          }`}
                        >
                          {tarefa.titulo}
                        </p>

                        <p className="mt-1 font-sans text-sm text-slate-500">
                          {new Date(tarefa.data_hora).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                          {tarefa.oportunidade?.pessoa_nome
                            ? ` • ${tarefa.oportunidade.pessoa_nome}`
                            : ""}
                        </p>

                      </div>

                      <button
                        onClick={() => {
                          setEditando(tarefa);
                          setModalAberto(true);
                        }}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleExcluir(tarefa)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  );
                })}

              </div>

            </div>

          ))

        )}

      </div>

      <NovaTarefaModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSaved={() => carregar(corretorSelecionado)}
        corretorPadrao={corretorSelecionado}
        tarefaEditando={editando}
      />

    </div>
  );
}
