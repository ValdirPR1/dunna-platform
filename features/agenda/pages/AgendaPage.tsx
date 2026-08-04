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
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import {
  excluirTarefa,
  listarTarefas,
  marcarConcluida,
} from "../services/tarefas.service";
import { Tarefa, TipoTarefa } from "../types/tarefa";
import {
  listarEventos,
  excluirEvento,
  responderParticipacao,
  marcarComparecimento,
} from "../services/eventos.service";
import { Evento } from "../types/evento";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import NovaTarefaModal from "../components/NovaTarefaModal";
import NovoEventoModal from "../components/NovoEventoModal";
import ConexaoGoogleAgenda from "../components/ConexaoGoogleAgenda";
import { useAuth } from "@/features/core/auth/useAuth";

const iconesPorTipo: Record<TipoTarefa, any> = {
  "Ligação": Phone,
  "WhatsApp": MessageCircle,
  "Visita": MapPin,
  "Reunião": Users,
  "Outro": CalendarDays,
};

type ItemAgenda =
  | { kind: "tarefa"; data_hora: string; data: Tarefa }
  | { kind: "evento"; data_hora: string; data: Evento };

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
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [corretorSelecionado, setCorretorSelecionado] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Tarefa | null>(null);
  const [modalEventoAberto, setModalEventoAberto] = useState(false);
  const [eventoPresencaId, setEventoPresencaId] = useState<string | null>(null);

  async function carregar(corretorId?: string) {
    setLoading(true);
    try {
      const idParaEventos =
        usuario?.papel === "corretor"
          ? usuario.corretor_id ?? undefined
          : corretorId || undefined;

      const [dadosTarefas, dadosEventos] = await Promise.all([
        listarTarefas(corretorId || undefined),
        listarEventos(idParaEventos),
      ]);
      setTarefas(dadosTarefas);
      setEventos(dadosEventos);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarCorretoresAtivos().then(setCorretores).catch(() => {});
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id]);

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

  async function handleExcluirEvento(evento: Evento) {
    const confirmado = window.confirm(`Excluir o evento "${evento.titulo}"?`);
    if (!confirmado) return;

    try {
      await excluirEvento(evento.id);
      toast.success("Evento excluído.");
      carregar(corretorSelecionado);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir o evento.");
    }
  }

  async function handleMarcarComparecimento(
    eventoParticipanteId: string,
    compareceu: boolean
  ) {
    try {
      await marcarComparecimento(eventoParticipanteId, compareceu);
      carregar(corretorSelecionado);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível marcar a presença.");
    }
  }

  async function handleResponder(
    evento: Evento,
    status: "confirmado" | "recusado"
  ) {
    if (!usuario?.corretor_id) return;

    try {
      await responderParticipacao(evento.id, usuario.corretor_id, status);
      toast.success(
        status === "confirmado" ? "Presença confirmada!" : "Presença recusada."
      );
      carregar(corretorSelecionado);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível registrar sua resposta.");
    }
  }

  const itensCombinados: ItemAgenda[] = [
    ...tarefas.map((t) => ({
      kind: "tarefa" as const,
      data_hora: t.data_hora,
      data: t,
    })),
    ...eventos.map((e) => ({
      kind: "evento" as const,
      data_hora: e.data_hora,
      data: e,
    })),
  ];

  const grupos = itensCombinados.reduce(
    (acc: Record<string, ItemAgenda[]>, item) => {
      const chave = chaveDoDia(item.data_hora);
      if (!acc[chave]) acc[chave] = [];
      acc[chave].push(item);
      return acc;
    },
    {}
  );

  Object.values(grupos).forEach((lista) =>
    lista.sort(
      (a, b) =>
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
    )
  );

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

          {usuario?.papel === "master" && (
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
          )}

          {usuario?.papel === "master" && (
            <button
              onClick={() => setModalEventoAberto(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-navy/10 bg-navy px-6 py-3 font-sans font-semibold text-white transition hover:bg-navy/90 sm:w-auto"
            >
              <Plus size={18} />
              Novo Evento
            </button>
          )}

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
              Nenhuma tarefa ou evento cadastrado ainda.
            </p>
          </div>

        ) : (

          Object.entries(grupos).map(([chave, itens]) => (

            <div key={chave}>

              <h2 className="mb-4 font-display text-xl font-bold text-navy">
                {rotuloDoDia(chave)}
              </h2>

              <div className="space-y-3">

                {itens.map((item) => {

                  if (item.kind === "evento") {
                    const evento = item.data;
                    const confirmados = evento.participantes.filter(
                      (p) => p.status === "confirmado"
                    );
                    const recusados = evento.participantes.filter(
                      (p) => p.status === "recusado"
                    );
                    const pendentes = evento.participantes.filter(
                      (p) => p.status === "pendente"
                    );

                    return (

                      <div
                        key={`evento-${evento.id}`}
                        className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm"
                      >

                        <div className="flex items-start gap-4">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
                            <Users size={18} />
                          </div>

                          <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-sans font-semibold text-navy">
                                {evento.titulo}
                              </p>
                              <span className="rounded-full bg-indigo-600 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-white">
                                Evento da equipe
                              </span>
                            </div>

                            <p className="mt-1 font-sans text-sm text-slate-500">
                              {new Date(evento.data_hora).toLocaleTimeString(
                                "pt-BR",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                              {evento.local ? ` • ${evento.local}` : ""}
                            </p>

                            {evento.descricao && (
                              <p className="mt-2 font-sans text-sm text-slate-600">
                                {evento.descricao}
                              </p>
                            )}

                            {usuario?.papel === "corretor" && (
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {evento.minhaParticipacao?.status === "confirmado" ? (
                                  <span className="flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 font-sans text-sm font-semibold text-emerald-700">
                                    <CheckCircle2 size={16} />
                                    Você confirmou presença
                                  </span>
                                ) : evento.minhaParticipacao?.status === "recusado" ? (
                                  <span className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 font-sans text-sm font-semibold text-red-700">
                                    <XCircle size={16} />
                                    Você recusou
                                  </span>
                                ) : null}

                                {evento.minhaParticipacao?.status !== "confirmado" && (
                                  <button
                                    onClick={() => handleResponder(evento, "confirmado")}
                                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 font-sans text-sm font-semibold text-white transition hover:bg-emerald-700"
                                  >
                                    <CheckCircle2 size={16} />
                                    Vou participar
                                  </button>
                                )}

                                {evento.minhaParticipacao?.status !== "recusado" && (
                                  <button
                                    onClick={() => handleResponder(evento, "recusado")}
                                    className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-sans text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                  >
                                    <XCircle size={16} />
                                    Não vou
                                  </button>
                                )}
                              </div>
                            )}

                            {usuario?.papel === "master" && (
                              <div className="mt-3 flex flex-wrap items-center gap-3 font-sans text-sm">
                                <span className="flex items-center gap-1 text-emerald-700">
                                  <CheckCircle2 size={14} />
                                  {confirmados.length} confirmado{confirmados.length === 1 ? "" : "s"}
                                </span>
                                <span className="flex items-center gap-1 text-red-600">
                                  <XCircle size={14} />
                                  {recusados.length} recusado{recusados.length === 1 ? "" : "s"}
                                </span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Clock size={14} />
                                  {pendentes.length} pendente{pendentes.length === 1 ? "" : "s"}
                                </span>

                                <button
                                  onClick={() =>
                                    setEventoPresencaId(
                                      eventoPresencaId === evento.id ? null : evento.id
                                    )
                                  }
                                  className="ml-auto flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                  <ClipboardCheck size={14} />
                                  Marcar presença
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform ${eventoPresencaId === evento.id ? "rotate-180" : ""}`}
                                  />
                                </button>
                              </div>
                            )}

                            {usuario?.papel === "master" && eventoPresencaId === evento.id && (
                              <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                                {evento.participantes.length === 0 ? (
                                  <p className="font-sans text-xs text-slate-400">
                                    Nenhum convidado nesse evento.
                                  </p>
                                ) : (
                                  evento.participantes.map((p) => (
                                    <div
                                      key={p.id}
                                      className="flex items-center justify-between gap-3 font-sans text-sm"
                                    >
                                      <span className="text-navy">{p.corretor?.nome ?? "Corretor"}</span>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleMarcarComparecimento(p.id, true)}
                                          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                            p.compareceu === true
                                              ? "bg-emerald-600 text-white"
                                              : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                                          }`}
                                        >
                                          Compareceu
                                        </button>
                                        <button
                                          onClick={() => handleMarcarComparecimento(p.id, false)}
                                          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                            p.compareceu === false
                                              ? "bg-red-500 text-white"
                                              : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                          }`}
                                        >
                                          Faltou
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}

                          </div>

                          {usuario?.papel === "master" && (
                            <button
                              onClick={() => handleExcluirEvento(evento)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                        </div>

                      </div>

                    );
                  }

                  const tarefa = item.data;
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
        corretorPadrao={
          usuario?.papel === "corretor"
            ? usuario.corretor_id ?? undefined
            : corretorSelecionado
        }
        tarefaEditando={editando}
      />

      {usuario?.papel === "master" && (
        <NovoEventoModal
          open={modalEventoAberto}
          onClose={() => setModalEventoAberto(false)}
          onSaved={() => carregar(corretorSelecionado)}
          corretores={corretores}
          criadoPor={usuario.id}
        />
      )}

    </div>
  );
}
