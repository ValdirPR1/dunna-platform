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
import {
  listarAtendimentos,
  criarAtendimento,
  AtendimentoLead,
} from "../services/atendimentos.service";
import { useAuth } from "@/features/core/auth/useAuth";
import { MessageSquarePlus } from "lucide-react";

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
  temperatura: "Morno",
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

  const [atendimentos, setAtendimentos] = useState<AtendimentoLead[]>([]);
  const [novoAtendimento, setNovoAtendimento] = useState("");
  const [salvandoAtendimento, setSalvandoAtendimento] = useState(false);
  const { usuario } = useAuth();

  const editando = Boolean(oportunidadeEditando);

  useEffect(() => {
    if (!open) return;

    listarCorretoresAtivos().then(setCorretores).catch(() => {});

    if (oportunidadeEditando) {
      listarAtendimentos(oportunidadeEditando.id).then(setAtendimentos);
    } else {
      setAtendimentos([]);
    }

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
        temperatura: oportunidadeEditando.temperatura ?? "Morno",
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

  async function registrarAtendimento() {
    if (!oportunidadeEditando || !novoAtendimento.trim()) return;

    setSalvandoAtendimento(true);

    try {
      await criarAtendimento(
        oportunidadeEditando.id,
        novoAtendimento.trim(),
        usuario?.nome
      );

      setNovoAtendimento("");
      const atualizados = await listarAtendimentos(oportunidadeEditando.id);
      setAtendimentos(atualizados);
      toast.success("Atendimento registrado!");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível registrar o atendimento.");
    } finally {
      setSalvandoAtendimento(false);
    }
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
              value={form.temperatura}
              onChange={(e) => atualizar("temperatura", e.target.value)}
              className={inputClass}
            >
              <option value="Frio">🔵 Lead Frio</option>
              <option value="Morno">🟡 Lead Morno</option>
              <option value="Quente">🔴 Lead Quente</option>
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

        {editando && (
          <div className="mt-6 border-t border-slate-100 pt-6">

            <h3 className="mb-3 font-sans font-semibold text-navy">
              Histórico de Atendimento
            </h3>

            <div className="flex gap-2">
              <textarea
                value={novoAtendimento}
                onChange={(e) => setNovoAtendimento(e.target.value)}
                placeholder="Ex: Liguei pro cliente, ele disse que prefere apartamento com 2 quartos e já tem entrada disponível..."
                rows={2}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-sm text-navy outline-none focus:border-gold"
              />
              <button
                onClick={registrarAtendimento}
                disabled={salvandoAtendimento || !novoAtendimento.trim()}
                className="flex items-center gap-2 self-start rounded-xl bg-navy px-4 py-3 font-sans text-sm font-semibold text-white transition hover:bg-navy/90 disabled:opacity-50"
              >
                <MessageSquarePlus size={16} />
                Registrar
              </button>
            </div>

            {atendimentos.length > 0 && (
              <div className="mt-4 max-h-52 space-y-3 overflow-y-auto pr-1">

                {atendimentos.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <p className="font-sans text-sm text-slate-700">
                      {a.texto}
                    </p>
                    <p className="mt-1 font-sans text-xs text-slate-400">
                      {a.autor ? `${a.autor} · ` : ""}
                      {new Date(a.created_at).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}

              </div>
            )}

          </div>
        )}

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
