"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Upload, X } from "lucide-react";
import {
  criarUnidade,
  listarCorretoresAtivos,
  listarEmpreendimentosResumo,
  salvarFotoUnidade,
  uploadFotoUnidade,
} from "../services/unidade.service";
import { Corretor, EmpreendimentoResumo } from "../types/unidade";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  // Quando informado, o modal já sabe o empreendimento (some o
  // seletor e o mapa usa direto os dados recebidos aqui).
  empreendimentoFixo?: EmpreendimentoResumo;
};

const camposIniciais = {
  empreendimento_id: "",
  torre: "",
  bloco: "",
  andar: "",
  numero: "",
  tipologia: "",
  quartos: "",
  suites: "",
  vagas: "",
  area: "",
  preco: "",
  comissao: "",
  status: "Disponível",
  corretor_id: "",
};

export default function NovaUnidadeModal({
  open,
  onClose,
  onSaved,
  empreendimentoFixo,
}: Props) {
  const [form, setForm] = useState(camposIniciais);
  const [empreendimentos, setEmpreendimentos] = useState<
    EmpreendimentoResumo[]
  >([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [fotos, setFotos] = useState<File[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) return;

    listarCorretoresAtivos().then(setCorretores).catch(() => {});

    if (empreendimentoFixo) {
      setForm((prev) => ({
        ...prev,
        empreendimento_id: empreendimentoFixo.id,
      }));
    } else {
      listarEmpreendimentosResumo().then(setEmpreendimentos).catch(() => {});
    }
  }, [open, empreendimentoFixo]);

  if (!open) return null;

  const empreendimentoParaMapa =
    empreendimentoFixo ??
    empreendimentos.find((e) => e.id === form.empreendimento_id);

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function adicionarFotos(arquivos: FileList | null) {
    if (!arquivos) return;
    setFotos((prev) => [...prev, ...Array.from(arquivos)]);
  }

  function removerFoto(index: number) {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSalvar() {
    if (!form.numero) {
      toast.error("Preencha o número da unidade.");
      return;
    }

    if (!form.empreendimento_id) {
      toast.error("Selecione um empreendimento.");
      return;
    }

    setSalvando(true);

    try {
      const unidade = await criarUnidade(form);

      for (let i = 0; i < fotos.length; i++) {
        const url = await uploadFotoUnidade(unidade.id, fotos[i]);
        await salvarFotoUnidade(unidade.id, url, i, i === 0);
      }

      toast.success("Unidade cadastrada com sucesso!");
      setForm({
        ...camposIniciais,
        empreendimento_id: empreendimentoFixo?.id ?? "",
      });
      setFotos([]);
      onSaved?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a unidade.");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-6 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="flex items-center justify-between">

          <h2 className="font-display text-3xl font-bold text-navy">
            Nova Unidade
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 font-sans text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>

        </div>

        {/* Empreendimento */}

        <div className="mt-8">

          {empreendimentoFixo ? (

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy">
              Empreendimento: <strong>{empreendimentoFixo.nome}</strong>
            </div>

          ) : (

            <>
              <label className="mb-2 block font-sans text-sm font-semibold text-slate-600">
                Empreendimento
              </label>

              <select
                value={form.empreendimento_id}
                onChange={(e) =>
                  atualizar("empreendimento_id", e.target.value)
                }
                className={inputClass + " w-full"}
              >
                <option value="">Selecione um empreendimento</option>
                {empreendimentos.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome} {emp.cidade ? `— ${emp.cidade}` : ""}
                  </option>
                ))}
              </select>
            </>

          )}

        </div>

        {/* Mapa */}

        {empreendimentoParaMapa?.latitude &&
          empreendimentoParaMapa?.longitude && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">

              <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 font-sans text-sm text-slate-500">
                <MapPin size={16} className="text-gold" />
                Localização do empreendimento
              </div>

              <iframe
                title="Mapa do empreendimento"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${empreendimentoParaMapa.latitude},${empreendimentoParaMapa.longitude}&output=embed`}
              />

            </div>
          )}

        {/* Dados da unidade */}

        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">

          <input
            value={form.torre}
            onChange={(e) => atualizar("torre", e.target.value)}
            placeholder="Torre"
            className={inputClass}
          />

          <input
            value={form.bloco}
            onChange={(e) => atualizar("bloco", e.target.value)}
            placeholder="Bloco"
            className={inputClass}
          />

          <input
            value={form.andar}
            onChange={(e) => atualizar("andar", e.target.value)}
            placeholder="Andar"
            type="number"
            className={inputClass}
          />

          <input
            value={form.numero}
            onChange={(e) => atualizar("numero", e.target.value)}
            placeholder="Número *"
            className={inputClass}
          />

        </div>

        <div className="mt-5">

          <input
            value={form.tipologia}
            onChange={(e) => atualizar("tipologia", e.target.value)}
            placeholder="Tipologia (ex: 2 quartos com suíte)"
            className={inputClass + " w-full"}
          />

        </div>

        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">

          <input
            value={form.quartos}
            onChange={(e) => atualizar("quartos", e.target.value)}
            placeholder="Quartos"
            type="number"
            className={inputClass}
          />

          <input
            value={form.suites}
            onChange={(e) => atualizar("suites", e.target.value)}
            placeholder="Suítes"
            type="number"
            className={inputClass}
          />

          <input
            value={form.vagas}
            onChange={(e) => atualizar("vagas", e.target.value)}
            placeholder="Vagas"
            type="number"
            className={inputClass}
          />

          <input
            value={form.area}
            onChange={(e) => atualizar("area", e.target.value)}
            placeholder="Área (m²)"
            type="number"
            className={inputClass}
          />

        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">

          <input
            value={form.preco}
            onChange={(e) => atualizar("preco", e.target.value)}
            placeholder="Preço (R$)"
            type="number"
            className={inputClass}
          />

          <input
            value={form.comissao}
            onChange={(e) => atualizar("comissao", e.target.value)}
            placeholder="Comissão (%)"
            type="number"
            className={inputClass}
          />

        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">

          <select
            value={form.status}
            onChange={(e) => atualizar("status", e.target.value)}
            className={inputClass}
          >
            <option value="Disponível">Disponível</option>
            <option value="Reservada">Reservada</option>
            <option value="Vendida">Vendida</option>
          </select>

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

        </div>

        {/* Fotos */}

        <div className="mt-8">

          <label className="mb-2 block font-sans text-sm font-semibold text-slate-600">
            Fotos da unidade
          </label>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-8 font-sans text-slate-500 transition hover:border-gold hover:text-gold">
            <Upload size={20} />
            Clique para escolher as fotos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => adicionarFotos(e.target.files)}
            />
          </label>

          {fotos.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-4">

              {fotos.map((file, i) => (
                <div key={i} className="relative">

                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Foto ${i + 1}`}
                    className="h-28 w-full rounded-xl object-cover"
                  />

                  {i === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-white">
                      Capa
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removerFoto(i)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                  >
                    <X size={14} className="text-slate-600" />
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Ações */}

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
            {salvando ? "Salvando..." : "Salvar Unidade"}
          </button>

        </div>

      </div>

    </div>
  );
}
