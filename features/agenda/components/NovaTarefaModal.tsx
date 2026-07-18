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

  const editando = Boolean(tarefaEditando);

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
    "rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="flex items-center justify-between">

          <h2 className="font-display text-3xl font-bold text-navy">
            {editando ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>

        </div>

        <div className="mt-8 grid gap-5">

          <div className="grid grid-cols-2 gap-5">

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

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-3 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Tarefa"}
          </button>

        </div>

      </div>

    </div>
  );
}
