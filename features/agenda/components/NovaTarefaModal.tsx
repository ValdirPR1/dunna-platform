"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import {
  atualizarTarefa,
  criarTarefa,
} from "../services/tarefas.service";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import { TIPOS_TAREFA, Tarefa } from "../types/tarefa";
import { useAuth } from "@/features/core/auth/useAuth";

// Converte um horário salvo (UTC) pro formato que o campo
// datetime-local entende, já no horário local de quem está vendo
function paraDatetimeLocalInput(isoString: string) {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Converte o valor "cru" do campo datetime-local (horário local de
// quem está digitando) pro horário UTC correto antes de salvar —
// sem isso, o banco entende a hora digitada como se já fosse UTC,
// e ela aparece errada depois (com a diferença do fuso, ex: 3h)
function paraUTCCorreto(datetimeLocalValue: string) {
  return new Date(datetimeLocalValue).toISOString();
}

interface OportunidadeOpcao {
  id: string;
  titulo: string;
  pessoaNome?: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  corretorPadrao?: string;
  tarefaEditando?: Tarefa | null;
};

const camposIniciais = {
  corretor_id: "",
  oportunidade_id: "",
  tipo: "Ligação",
  titulo: "",
  data_hora: "",
  observacoes: "",
};

export default function NovaTarefaModal({
  open,
  onClose,
  onSaved,
  corretorPadrao,
  tarefaEditando,
}: Props) {
  const [form, setForm] = useState(camposIniciais);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [oportunidades, setOportunidades] = useState<OportunidadeOpcao[]>([]);
  const [salvando, setSalvando] = useState(false);
  const { usuario } = useAuth();

  const editando = Boolean(tarefaEditando);
  const souCorretor = usuario?.papel === "corretor";

  useEffect(() => {
    if (!open) return;

    listarCorretoresAtivos().then(setCorretores).catch(() => {});

    supabase
      .from("oportunidades")
      .select("id, titulo, pessoas(nome)")
      .then(({ data }) => {
        setOportunidades(
          (data ?? []).map((o: any) => ({
            id: o.id,
            titulo: o.titulo,
            pessoaNome: o.pessoas?.nome,
          }))
        );
      });

    if (tarefaEditando) {
      setForm({
        corretor_id: tarefaEditando.corretor_id ?? "",
        oportunidade_id: tarefaEditando.oportunidade_id ?? "",
        tipo: tarefaEditando.tipo,
        titulo: tarefaEditando.titulo,
        data_hora: tarefaEditando.data_hora
          ? paraDatetimeLocalInput(tarefaEditando.data_hora)
          : "",
        observacoes: tarefaEditando.observacoes ?? "",
      });
    } else {
      setForm({
        ...camposIniciais,
        corretor_id: corretorPadrao ?? "",
      });
    }
  }, [open, tarefaEditando, corretorPadrao]);

  if (!open) return null;

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSalvar() {
    if (!form.titulo || !form.data_hora) {
      toast.error("Preencha o título e a data/hora.");
      return;
    }

    setSalvando(true);

    const formCorrigido = {
      ...form,
      data_hora: paraUTCCorreto(form.data_hora),
    };

    try {
      if (editando && tarefaEditando) {
        await atualizarTarefa(tarefaEditando.id, formCorrigido);
        toast.success("Tarefa atualizada!");
      } else {
        await criarTarefa(formCorrigido);
        toast.success("Tarefa criada!");
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a tarefa.");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden bg-navy/50 p-3 backdrop-blur-sm sm:p-6">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">

        <div className="flex min-w-0 items-center justify-between gap-3">

          <h2 className="min-w-0 truncate font-display text-xl font-bold text-navy sm:text-3xl">
            {editando ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>

          <button
            onClick={onClose}
            className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 font-sans text-sm text-slate-600 transition hover:bg-slate-50 sm:px-5 sm:text-base"
          >
            Fechar
          </button>

        </div>

        <div className="mt-6 grid min-w-0 gap-5 sm:mt-8">

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">

            <select
              value={form.tipo}
              onChange={(e) => atualizar("tipo", e.target.value)}
              className={inputClass}
            >
              {TIPOS_TAREFA.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>

            <input
              value={form.data_hora}
              onChange={(e) => atualizar("data_hora", e.target.value)}
              type="datetime-local"
              className={inputClass}
            />

          </div>

          <input
            value={form.titulo}
            onChange={(e) => atualizar("titulo", e.target.value)}
            placeholder="Título (ex: Ligar pro Carlos Henrique)"
            className={inputClass}
          />

          {souCorretor ? (
            <div
              className={`${inputClass} flex items-center bg-slate-100 text-slate-500`}
              title="Tarefas que você cria ficam atribuídas a você"
            >
              {usuario?.nome ?? "Você"}
            </div>
          ) : (
            <select
              value={form.corretor_id}
              onChange={(e) => atualizar("corretor_id", e.target.value)}
              className={inputClass}
            >
              <option value="">Sem corretor definido</option>
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}

          <select
            value={form.oportunidade_id}
            onChange={(e) => atualizar("oportunidade_id", e.target.value)}
            className={inputClass}
          >
            <option value="">Não vincular a um lead</option>
            {oportunidades.map((o) => (
              <option key={o.id} value={o.id}>
                {o.titulo} {o.pessoaNome ? `— ${o.pessoaNome}` : ""}
              </option>
            ))}
          </select>

          <textarea
            value={form.observacoes}
            onChange={(e) => atualizar("observacoes", e.target.value)}
            placeholder="Observações"
            rows={3}
            className={inputClass}
          />

        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 px-6 py-3 font-sans text-slate-600 transition hover:bg-slate-50 sm:w-auto"
          >
            Cancelar
          </button>

          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="w-full rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60 sm:w-auto"
          >
            {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Tarefa"}
          </button>

        </div>

      </div>

    </div>
  );
}
