"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Plus, Search } from "lucide-react";
import { ClienteCrm, COR_ETAPA, ETAPAS, ORIGENS } from "../types";
import { formatarMoeda, linkWhatsapp } from "../utils";

interface Props {
  clientes: ClienteCrm[];
  onNovo: () => void;
  onAbrir: (c: ClienteCrm) => void;
}

export default function ListaClientes({ clientes, onNovo, onAbrir }: Props) {
  const [busca, setBusca] = useState("");
  const [etapa, setEtapa] = useState("");
  const [origem, setOrigem] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return clientes.filter((c) => {
      if (etapa && c.etapa !== etapa) return false;
      if (origem && c.origem !== origem) return false;
      if (!termo) return true;
      return [c.nome, c.telefone, c.email, c.interesse]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(termo));
    });
  }, [clientes, busca, etapa, origem]);

  const sel = "rounded-xl border border-slate-200 bg-white p-3 font-sans text-sm text-slate-700 outline-none focus:border-gold";

  return (
    <div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, telefone, interesse..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 font-sans text-sm outline-none focus:border-gold"
          />
        </div>
        <select value={etapa} onChange={(e) => setEtapa(e.target.value)} className={sel}>
          <option value="">Todas as etapas</option>
          {ETAPAS.map((e) => <option key={e}>{e}</option>)}
        </select>
        <select value={origem} onChange={(e) => setOrigem(e.target.value)} className={sel}>
          <option value="">Todas as origens</option>
          {ORIGENS.map((e) => <option key={e}>{e}</option>)}
        </select>
        <button onClick={onNovo} className="flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white hover:bg-gold-dark">
          <Plus size={18} /> Novo cliente
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtrados.length === 0 ? (
          <p className="p-10 text-center font-sans text-slate-400">
            {clientes.length === 0
              ? "Nenhum cliente ainda. Clique em \"Novo cliente\" para cadastrar o primeiro."
              : "Nenhum cliente com esses filtros."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtrados.map((c) => {
              const zap = linkWhatsapp(c.telefone);
              return (
                <li key={c.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                  <button onClick={() => onAbrir(c)} className="min-w-0 flex-1 text-left">
                    <p className="truncate font-sans font-semibold text-navy">{c.nome}</p>
                    <p className="mt-0.5 truncate font-sans text-sm text-slate-500">
                      {[c.interesse, c.telefone].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </button>

                  <span className="hidden font-sans text-sm text-slate-500 md:block">{c.origem}</span>

                  {c.valor_estimado ? (
                    <span className="hidden font-sans text-sm text-slate-600 lg:block">
                      {formatarMoeda(c.valor_estimado)}
                    </span>
                  ) : null}

                  <span
                    className="shrink-0 rounded-full px-3 py-1 font-sans text-xs font-semibold text-white"
                    style={{ background: COR_ETAPA[c.etapa] ?? "#64748b" }}
                  >
                    {c.etapa}
                  </span>

                  {zap && (
                    <a href={zap} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp" className="shrink-0 text-[#25D366] hover:opacity-80">
                      <MessageCircle size={20} />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
}
