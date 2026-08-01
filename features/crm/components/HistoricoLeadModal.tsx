"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, History, MessageSquarePlus, Phone, Mail, User } from "lucide-react";
import { Oportunidade } from "../types/oportunidade";
import {
  listarAtendimentos,
  criarAtendimento,
  AtendimentoLead,
} from "../services/atendimentos.service";
import { useAuth } from "@/features/core/auth/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
  oportunidade: Oportunidade | null;
}

// Modal só de leitura pra ver rapidinho de onde o lead veio e o que já
// rolou de atendimento com ele, sem precisar abrir o modal de edição
// (que mistura isso com todos os campos editáveis do lead).
export default function HistoricoLeadModal({ open, onClose, oportunidade }: Props) {
  const [atendimentos, setAtendimentos] = useState<AtendimentoLead[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [novoAtendimento, setNovoAtendimento] = useState("");
  const [salvando, setSalvando] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    if (!open || !oportunidade) return;

    setCarregando(true);
    listarAtendimentos(oportunidade.id)
      .then(setAtendimentos)
      .finally(() => setCarregando(false));
  }, [open, oportunidade]);

  if (!open || !oportunidade) return null;

  async function registrar() {
    if (!oportunidade || !novoAtendimento.trim()) return;

    setSalvando(true);

    try {
      await criarAtendimento(oportunidade.id, novoAtendimento.trim(), usuario?.nome);
      setNovoAtendimento("");
      const atualizados = await listarAtendimentos(oportunidade.id);
      setAtendimentos(atualizados);
      toast.success("Atendimento registrado!");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível registrar o atendimento.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 backdrop-blur-sm">

      <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <History size={22} className="text-gold" />
            <h2 className="font-display text-2xl font-bold text-navy">
              Histórico do Lead
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">

          <p className="flex items-center gap-2 font-sans font-semibold text-navy">
            <User size={14} className="text-slate-400" />
            {oportunidade.pessoa?.nome ?? "Pessoa não identificada"}
          </p>

          {oportunidade.pessoa?.telefone && (
            <p className="mt-2 flex items-center gap-2 font-sans text-sm text-slate-500">
              <Phone size={14} className="text-slate-400" />
              {oportunidade.pessoa.telefone}
            </p>
          )}

          {oportunidade.pessoa?.email && (
            <p className="mt-2 flex items-center gap-2 font-sans text-sm text-slate-500">
              <Mail size={14} className="text-slate-400" />
              {oportunidade.pessoa.email}
            </p>
          )}

        </div>

        <div className="mt-6">
          <h3 className="mb-2 font-sans text-sm font-semibold text-navy">
            Origem / mensagem inicial
          </h3>
          <p className="whitespace-pre-line rounded-2xl border border-slate-100 bg-white p-4 font-sans text-sm text-slate-600">
            {oportunidade.observacoes || "Sem informação de origem registrada."}
          </p>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">

          <h3 className="mb-3 font-sans font-semibold text-navy">
            Histórico de Atendimento
          </h3>

          <div className="flex gap-2">
            <textarea
              value={novoAtendimento}
              onChange={(e) => setNovoAtendimento(e.target.value)}
              placeholder="Registrar um novo atendimento..."
              rows={2}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-sm text-navy outline-none focus:border-gold"
            />
            <button
              onClick={registrar}
              disabled={salvando || !novoAtendimento.trim()}
              className="flex items-center gap-2 self-start rounded-xl bg-navy px-4 py-3 font-sans text-sm font-semibold text-white transition hover:bg-navy/90 disabled:opacity-50"
            >
              <MessageSquarePlus size={16} />
              Registrar
            </button>
          </div>

          {carregando ? (
            <p className="mt-4 font-sans text-sm text-slate-400">Carregando...</p>
          ) : atendimentos.length > 0 ? (
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {atendimentos.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="font-sans text-sm text-slate-700">{a.texto}</p>
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
          ) : (
            <p className="mt-4 font-sans text-sm text-slate-400">
              Nenhum atendimento registrado ainda.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}
