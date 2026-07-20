"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import {
  atualizarCorretor,
  Corretor,
  criarCorretor,
  uploadFotoCorretor,
} from "../services/corretores.service";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  corretorEditando?: Corretor | null;
};

export default function CorretorModal({
  open,
  onClose,
  onSaved,
  corretorEditando,
}: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [creci, setCreci] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  const editando = Boolean(corretorEditando);

  useEffect(() => {
    if (!open) return;

    if (corretorEditando) {
      setNome(corretorEditando.nome ?? "");
      setTelefone(corretorEditando.telefone ?? "");
      setEmail(corretorEditando.email ?? "");
      setCreci(corretorEditando.creci ?? "");
      setFotoUrl(corretorEditando.foto ?? null);
    } else {
      setNome("");
      setTelefone("");
      setEmail("");
      setCreci("");
      setFotoUrl(null);
    }

    setArquivoFoto(null);
    setPreviewFoto(null);
  }, [open, corretorEditando]);

  if (!open) return null;

  function escolherFoto(file: File | null) {
    if (!file) return;
    setArquivoFoto(file);
    setPreviewFoto(URL.createObjectURL(file));
  }

  async function handleSalvar() {
    if (!nome) {
      toast.error("Preencha o nome do corretor.");
      return;
    }

    setSalvando(true);

    try {
      if (editando && corretorEditando) {
        await atualizarCorretor(corretorEditando.id, {
          nome,
          telefone,
          email,
          creci,
        });

        if (arquivoFoto) {
          await uploadFotoCorretor(corretorEditando.id, arquivoFoto);
        }

        toast.success("Corretor atualizado!");
      } else {
        const novoCorretor = await criarCorretor({
          nome,
          telefone,
          email,
          creci,
        });

        if (arquivoFoto) {
          await uploadFotoCorretor(novoCorretor.id, arquivoFoto);
        }

        toast.success("Corretor cadastrado!");
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o corretor.");
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
            {editando ? "Editar Corretor" : "Novo Corretor"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>

        </div>

        <div className="mt-6 space-y-4">

          <div className="flex items-center gap-4">

            <div
              className="h-20 w-20 shrink-0 rounded-full bg-slate-100 bg-cover bg-center"
              style={
                previewFoto || fotoUrl
                  ? { backgroundImage: `url(${previewFoto || fotoUrl})` }
                  : undefined
              }
            />

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 font-sans text-sm text-slate-500 transition hover:border-gold hover:text-gold">
              <Upload size={16} />
              {fotoUrl || previewFoto ? "Trocar foto" : "Adicionar foto"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  escolherFoto(e.target.files?.[0] ?? null)
                }
              />
            </label>

          </div>

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className={inputClass}
          />

          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            className={inputClass}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className={inputClass}
          />

          <input
            value={creci}
            onChange={(e) => setCreci(e.target.value)}
            placeholder="CRECI"
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
            {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Corretor"}
          </button>

        </div>

      </div>

    </div>
  );
}
