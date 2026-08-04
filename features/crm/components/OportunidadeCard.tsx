"use client";

import { Pencil, Trash2, Clock, User, CheckCircle2, XCircle, History, MessageCircle } from "lucide-react";
import { Oportunidade } from "../types/oportunidade";

// Monta o link do WhatsApp a partir do telefone salvo. Números novos
// já vêm no formato "+DDI número" (ver features/site/utils/telefone.ts),
// mas leads antigos podem ter só o número local brasileiro — nesse
// caso assume Brasil (55) pra não quebrar o link.
function linkWhatsapp(numero: string | null | undefined) {
  if (!numero) return null;
  const digitos = numero.replace(/\D/g, "");
  if (!digitos) return null;
  const comDdi = digitos.length <= 11 ? `55${digitos}` : digitos;
  return `https://wa.me/${comDdi}`;
}

interface Props {
  oportunidade: Oportunidade;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onEditar: (oportunidade: Oportunidade) => void;
  onExcluir: (oportunidade: Oportunidade) => void;
  onVerHistorico?: (oportunidade: Oportunidade) => void;
  onVendaRealizada?: (oportunidade: Oportunidade) => void;
  onVendaPerdida?: (oportunidade: Oportunidade) => void;
}

function formatarPreco(valor: number | null) {
  if (!valor) return null;
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function diasSemMovimentacao(dataISO: string | null) {
  if (!dataISO) return null;
  const diff = Date.now() - new Date(dataISO).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const corPrioridade: Record<string, string> = {
  Alta: "bg-red-100 text-red-700",
  Normal: "bg-amber-100 text-amber-700",
  Baixa: "bg-slate-100 text-slate-600",
};

const corTemperatura: Record<string, string> = {
  Frio: "border-l-blue-400",
  Morno: "border-l-yellow-400",
  Quente: "border-l-red-500",
};

export default function OportunidadeCard({
  oportunidade,
  onDragStart,
  onEditar,
  onExcluir,
  onVerHistorico,
  onVendaRealizada,
  onVendaPerdida,
}: Props) {
  const valor =
    formatarPreco(oportunidade.valor_venda ?? null) ??
    formatarPreco(oportunidade.valor_previsto) ??
    formatarPreco(oportunidade.valor_interesse);

  const dias = diasSemMovimentacao(
    oportunidade.atualizado_em ?? oportunidade.criado_em
  );
  const parado = dias !== null && dias >= 15;

  // Enquanto o lead está em "Contrato", o negócio ainda não foi
  // decidido: ou o contrato é assinado (venda realizada, segue pro
  // Pós-venda) ou não anda / o cliente desiste / some (venda
  // perdida). Por isso o card mostra essa decisão em destaque
  // enquanto estiver nessa coluna.
  const aguardandoDecisao =
    oportunidade.etapa === "Contrato" && (onVendaRealizada || onVendaPerdida);

  const zap = linkWhatsapp(oportunidade.pessoa?.whatsapp ?? oportunidade.pessoa?.telefone);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, oportunidade.id)}
      className={`group cursor-grab rounded-2xl border border-l-4 border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing ${
        corTemperatura[oportunidade.temperatura] ?? "border-l-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans font-semibold text-navy">
          {oportunidade.titulo || "Sem título"}
        </h3>

        <div className="flex shrink-0 flex-col items-end gap-1">

          <span
            className={`rounded-full px-2 py-1 font-sans text-xs font-semibold ${
              corPrioridade[oportunidade.prioridade] ??
              corPrioridade.Normal
            }`}
          >
            {oportunidade.prioridade}
          </span>

          {oportunidade.temperatura && (
            <span
              className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold ${
                oportunidade.temperatura === "Frio"
                  ? "bg-blue-50 text-blue-600"
                  : oportunidade.temperatura === "Quente"
                  ? "bg-red-50 text-red-600"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {oportunidade.temperatura}
            </span>
          )}

        </div>
      </div>

      <p className="mt-2 font-sans text-sm text-slate-500">
        {oportunidade.pessoa?.nome ?? "Pessoa não identificada"}
      </p>

      {oportunidade.corretor?.nome && (
        <p className="mt-1.5 flex items-center gap-1 font-sans text-xs text-slate-400">
          <User size={12} />
          {oportunidade.corretor.nome}
        </p>
      )}

      {valor && (
        <p className="mt-2 font-sans text-sm font-semibold text-gold">
          {valor}
        </p>
      )}

      {oportunidade.previsao_fechamento && (
        <p className="mt-2 font-sans text-xs text-slate-400">
          Previsão:{" "}
          {new Date(
            oportunidade.previsao_fechamento
          ).toLocaleDateString("pt-BR")}
        </p>
      )}

      {dias !== null && (
        <p
          className={`mt-2 flex items-center gap-1 font-sans text-xs ${
            parado ? "font-semibold text-red-500" : "text-slate-400"
          }`}
        >
          <Clock size={12} />
          {dias === 0
            ? "Movimentado hoje"
            : `Há ${dias} dia${dias > 1 ? "s" : ""} sem movimentação`}
        </p>
      )}

      {aguardandoDecisao && (
        <div className="mt-3 rounded-xl border border-gold/30 bg-gold/5 p-2">
          <p className="mb-2 font-sans text-[11px] font-semibold text-slate-500">
            Contrato assinado?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onVendaRealizada?.(oportunidade)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 font-sans text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              <CheckCircle2 size={13} />
              Contrato Assinado
            </button>
            <button
              onClick={() => onVendaPerdida?.(oportunidade)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-1.5 font-sans text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              <XCircle size={13} />
              Venda Perdida
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

        {zap ? (
          <a
            href={zap}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 px-2.5 py-1.5 font-sans text-xs font-semibold text-[#1a9e53] transition hover:bg-[#25D366]/20"
            aria-label="Abrir WhatsApp"
            title="Abrir conversa no WhatsApp"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        ) : (
          <span />
        )}

        <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">

          {onVerHistorico && (
            <button
              onClick={() => onVerHistorico(oportunidade)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
              aria-label="Ver histórico"
              title="Ver histórico / origem"
            >
              <History size={14} />
            </button>
          )}

          <button
            onClick={() => onEditar(oportunidade)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            aria-label="Editar"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={() => onExcluir(oportunidade)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Excluir"
          >
            <Trash2 size={14} />
          </button>

        </div>

      </div>
    </div>
  );
}
