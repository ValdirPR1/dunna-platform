"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  atualizarLead,
  criarLead,
} from "../services/oportunidades.service";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import { Oportunidade } from "../types/oportunidade";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  // Quando informado, o modal abre em modo edição.
  oportunidadeEditando?: Oportunidade | null;
}

const camposIniciais = {
  nome: "",
  email: "",
  telefone: "",
  whatsapp: "",
  titulo: "",
  valor_interesse: "",
  prioridade: "Normal",
  problema: "",
  corretor_id: "",
};

export default function LeadModal({
  open,
  onClose,
  onSaved,
  oportunidadeEditando,
}: Props) {
  const [form, setForm] = useState(camposIniciais);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [salvando, setSalvando] = useState(false);

  const editando = Boolean(oportunidadeEditando);

  useEffect(() => {
    if (!open) return;

    listarCorretoresAtivos().then(setCorretores).catch(() => {});

    if (oportunidadeEditando) {
      setForm({
        nome: oportunidadeEditando.pessoa?.nome ?? "",
        email: oportunidadeEditando.pessoa?.email ?? "",
        telefone: oportunidadeEditando.pessoa?.telefone ?? "",
        whatsapp: oportunidadeEditando.pessoa?.whatsapp ?? "",
        titulo: oportunidadeEditando.titulo ?? "",
        valor_interesse:
          oportunidadeEditando.valor_interesse?.toString() ?? "",
        prioridade: oportunidadeEditando.prioridade ?? "Normal",
        problema: oportunidadeEditando.observacoes ?? "",
        corretor_id: oportunidadeEditando.corretor_id ?? "",
      });
    } else {
      setForm(camposIniciais);
    }
  }, [open, oportunidadeEditando]);

  if (!open) return null;

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSalvar() {
    if (!form.nome) {
      toast.error("Preencha o nome do lead.");
      return;
    }

    setSalvando(true);

    try {
      if (editando && oportunidadeEditando) {
        await atualizarLead(oportunidadeEditando.id, {
          pessoa_id: oportunidadeEditando.pessoa_id,
          ...form,
        });
        toast.success("Lead atualizado!");
      } else {
        await criarLead(form);
        toast.success("Lead criado!");
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o lead.");
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
            {editando ? "Editar Lead" : "Novo Lead"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>

        </div>

        <div className="mt-8 grid gap-5">

          <input
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            placeholder="Nome *"
            className={inputClass}
          />

          <div className="grid grid-cols-2 gap-5">

            <input
              value={form.email}
              onChange={(e) => atualizar("email", e.target.value)}
              placeholder="E-mail"
              className={inputClass}
            />

            <input
              value={form.telefone}
              onChange={(e) => atualizar("telefone", e.target.value)}
              placeholder="Telefone"
              className={inputClass}
            />

          </div>

          <input
            value={form.whatsapp}
            onChange={(e) => atualizar("whatsapp", e.target.value)}
            placeholder="WhatsApp"
            className={inputClass}
          />

          <input
            value={form.titulo}
            onChange={(e) => atualizar("titulo", e.target.value)}
            placeholder="Título da oportunidade (ex: Interesse em apto 2Q)"
            className={inputClass}
          />

          <textarea
            value={form.problema}
            onChange={(e) => atualizar("problema", e.target.value)}
            placeholder="O que a pessoa está procurando / mensagem"
            rows={3}
            className={inputClass}
          />

          <div className="grid grid-cols-3 gap-5">

            <input
              value={form.valor_interesse}
              onChange={(e) => atualizar("valor_interesse", e.target.value)}
              placeholder="Valor de interesse (R$)"
              type="number"
              className={inputClass}
            />

            <select
              value={form.prioridade}
              onChange={(e) => atualizar("prioridade", e.target.value)}
              className={inputClass}
            >
              <option value="Baixa">Prioridade Baixa</option>
              <option value="Normal">Prioridade Normal</option>
              <option value="Alta">Prioridade Alta</option>
            </select>

            <select
              value={form.corretor_id}
              onChange={(e) => atualizar("corretor_id", e.target.value)}
              className={inputClass}
            >
              <option value="">Sem corretor</option>
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

          </div>

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
            {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Lead"}
          </button>

        </div>

      </div>

    </div>
  );
}
