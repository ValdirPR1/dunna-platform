"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { criarUsuario } from "../services/configuracoes.service";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function NovoUsuarioModal({ open, onClose, onSaved }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState<"master" | "corretor">("corretor");
  const [corretorId, setCorretorId] = useState("");
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) return;
    listarCorretoresAtivos().then(setCorretores).catch(() => {});
    setNome("");
    setEmail("");
    setSenha("");
    setPapel("corretor");
    setCorretorId("");
  }, [open]);

  if (!open) return null;

  async function handleSalvar() {
    if (!nome || !email || !senha) {
      toast.error("Preencha nome, e-mail e senha.");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setSalvando(true);

    try {
      await criarUsuario({
        nome,
        email,
        senha,
        papel,
        corretor_id: corretorId || undefined,
      });

      toast.success("Usuário criado com sucesso!");
      onSaved();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Não foi possível criar o usuário.");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="flex items-center justify-between">

          <h2 className="font-display text-2xl font-bold text-navy">
            Novo Usuário
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>

        </div>

        <div className="mt-6 space-y-4">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className={inputClass}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail"
            className={inputClass}
          />

          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            className={inputClass}
          />

          <select
            value={papel}
            onChange={(e) => setPapel(e.target.value as "master" | "corretor")}
            className={inputClass}
          >
            <option value="corretor">Corretor</option>
            <option value="master">Master</option>
          </select>

          {papel === "corretor" && (
            <select
              value={corretorId}
              onChange={(e) => setCorretorId(e.target.value)}
              className={inputClass}
            >
              <option value="">Vincular a um corretor cadastrado (opcional)</option>
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}

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
            {salvando ? "Criando..." : "Criar Usuário"}
          </button>

        </div>

      </div>

    </div>
  );
}
