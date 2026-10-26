"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { ClienteCrm, ETAPAS, ORIGENS } from "../types";
import { salvarCliente } from "../services/meucrm.service";
import { inputClass, labelClass } from "../utils";

interface Props {
  aberto: boolean;
  cliente?: ClienteCrm | null;
  onFechar: () => void;
  onSalvo: () => void;
}

const vazio = {
  nome: "",
  telefone: "",
  email: "",
  origem: "Instagram",
  etapa: "Novo",
  interesse: "",
  valor_estimado: "",
  observacoes: "",
};

export default function ClienteModal({ aberto, cliente, onFechar, onSalvo }: Props) {
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    setForm(
      cliente
        ? {
            nome: cliente.nome,
            telefone: cliente.telefone ?? "",
            email: cliente.email ?? "",
            origem: cliente.origem,
            etapa: cliente.etapa,
            interesse: cliente.interesse ?? "",
            valor_estimado: cliente.valor_estimado?.toString() ?? "",
            observacoes: cliente.observacoes ?? "",
          }
        : vazio
    );
  }, [aberto, cliente]);

  if (!aberto) return null;

  function set(campo: keyof typeof vazio, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function salvar() {
    if (!form.nome.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    setSalvando(true);
    try {
      await salvarCliente(
        {
          nome: form.nome.trim(),
          telefone: form.telefone.trim() || null,
          email: form.email.trim() || null,
          origem: form.origem,
          etapa: form.etapa,
          interesse: form.interesse.trim() || null,
          valor_estimado: form.valor_estimado
            ? Number(form.valor_estimado.replace(/\./g, "").replace(",", "."))
            : null,
          observacoes: form.observacoes.trim() || null,
        },
        cliente?.id
      );
      toast.success(cliente ? "Cliente atualizado!" : "Cliente cadastrado!");
      onSalvo();
      onFechar();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar. Rodou a migração no Supabase?");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">
            {cliente ? "Editar cliente" : "Novo cliente"}
          </h2>
          <button onClick={onFechar} aria-label="Fechar" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="md:col-span-2">
            <label className={labelClass}>Nome *</label>
            <input value={form.nome} onChange={(e) => set("nome", e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>WhatsApp / telefone</label>
            <input value={form.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="(81) 99999-9999" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>E-mail</label>
            <input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>De onde veio</label>
            <select value={form.origem} onChange={(e) => set("origem", e.target.value)} className={inputClass}>
              {ORIGENS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Etapa</label>
            <select value={form.etapa} onChange={(e) => set("etapa", e.target.value)} className={inputClass}>
              {ETAPAS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Interesse</label>
            <input value={form.interesse} onChange={(e) => set("interesse", e.target.value)} placeholder="Ex: apto 2 quartos em Carneiros" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Valor estimado (R$)</label>
            <input value={form.valor_estimado} onChange={(e) => set("valor_estimado", e.target.value)} inputMode="decimal" placeholder="Ex: 800000" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Observações</label>
            <textarea value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} rows={3} className={inputClass} />
          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onFechar} className="rounded-xl border border-slate-200 px-6 py-3 font-sans font-semibold text-slate-600 hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={salvar} disabled={salvando} className="rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white hover:bg-gold-dark disabled:opacity-60">
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>

      </div>
    </div>
  );
}
