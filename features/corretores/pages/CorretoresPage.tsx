"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Phone, Mail, BadgeCheck } from "lucide-react";
import {
  alternarAtivoCorretor,
  buscarDesempenhoCorretores,
  Corretor,
  DesempenhoCorretor,
  listarCorretores,
} from "../services/corretores.service";
import CorretorModal from "../components/CorretorModal";

export default function CorretoresPage() {
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [desempenho, setDesempenho] = useState<
    Record<string, DesempenhoCorretor>
  >({});
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Corretor | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const [listaCorretores, dadosDesempenho] = await Promise.all([
        listarCorretores(),
        buscarDesempenhoCorretores(),
      ]);
      setCorretores(listaCorretores);
      setDesempenho(dadosDesempenho);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleAlternarAtivo(corretor: Corretor) {
    try {
      await alternarAtivoCorretor(corretor.id, !corretor.ativo);
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o corretor.");
    }
  }

  return (
    <div>

      <div className="flex items-start justify-between">

        <div>

          <h1 className="font-display text-3xl font-bold text-navy">
            Corretores
          </h1>

          <p className="mt-2 font-sans text-slate-500">
            Equipe de vendas e desempenho de cada corretor.
          </p>

        </div>

        <button
          onClick={() => {
            setEditando(null);
            setModalAberto(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
        >
          <Plus size={18} />
          Novo Corretor
        </button>

      </div>

      <div className="mt-8">

        {loading ? (

          <p className="font-sans text-slate-400">Carregando...</p>

        ) : corretores.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <p className="font-sans text-slate-500">
              Nenhum corretor cadastrado ainda.
            </p>
          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {corretores.map((corretor) => {
              const stats = desempenho[corretor.id] ?? {
                totalOportunidades: 0,
                emAndamento: 0,
                fechados: 0,
                temLogin: false,
              };

              return (

                <div
                  key={corretor.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-4">

                      <div
                        className="h-14 w-14 shrink-0 rounded-full bg-slate-200 bg-cover bg-center"
                        style={
                          corretor.foto
                            ? { backgroundImage: `url(${corretor.foto})` }
                            : undefined
                        }
                      />

                      <div>

                        <p className="font-sans font-semibold text-navy">
                          {corretor.nome}
                        </p>

                        {corretor.creci && (
                          <p className="font-sans text-sm text-slate-500">
                            CRECI {corretor.creci}
                          </p>
                        )}

                      </div>

                    </div>

                    <button
                      onClick={() => {
                        setEditando(corretor);
                        setModalAberto(true);
                      }}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                    >
                      <Pencil size={16} />
                    </button>

                  </div>

                  <div className="mt-5 space-y-2 font-sans text-sm text-slate-500">

                    {corretor.telefone && (
                      <p className="flex items-center gap-2">
                        <Phone size={14} />
                        {corretor.telefone}
                      </p>
                    )}

                    {corretor.email && (
                      <p className="flex items-center gap-2">
                        <Mail size={14} />
                        {corretor.email}
                      </p>
                    )}

                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">

                    <div>
                      <p className="font-display text-xl font-bold text-navy">
                        {stats.totalOportunidades}
                      </p>
                      <p className="font-sans text-xs text-slate-500">
                        Oportunidades
                      </p>
                    </div>

                    <div>
                      <p className="font-display text-xl font-bold text-navy">
                        {stats.emAndamento}
                      </p>
                      <p className="font-sans text-xs text-slate-500">
                        Em andamento
                      </p>
                    </div>

                    <div>
                      <p className="font-display text-xl font-bold text-gold">
                        {stats.fechados}
                      </p>
                      <p className="font-sans text-xs text-slate-500">
                        Fechados
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold ${
                        stats.temLogin
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <BadgeCheck size={12} />
                      {stats.temLogin ? "Tem login" : "Sem login"}
                    </span>

                    <button
                      onClick={() => handleAlternarAtivo(corretor)}
                      className={`rounded-full px-4 py-1 font-sans text-xs font-semibold ${
                        corretor.ativo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {corretor.ativo ? "Ativo" : "Inativo"}
                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

      <CorretorModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSaved={carregar}
        corretorEditando={editando}
      />

    </div>
  );
}
