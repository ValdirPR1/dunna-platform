"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Star } from "lucide-react";
import {
  AvaliacaoManual,
  criarAvaliacaoManual,
  excluirAvaliacaoManual,
  listarAvaliacoesManuais,
} from "../services/avaliacoes.service";
import {
  obterConfiguracoes,
  salvarConfiguracao,
} from "@/features/configuracoes/services/configuracoes.service";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-navy outline-none focus:border-gold";
const labelClass = "mb-2 block font-sans text-sm font-medium text-slate-600";

export default function AvaliacoesManuaisAdmin() {
  const [lista, setLista] = useState<AvaliacaoManual[]>([]);
  const [autor, setAutor] = useState("");
  const [nota, setNota] = useState("5");
  const [texto, setTexto] = useState("");
  const [quando, setQuando] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [perfilUrl, setPerfilUrl] = useState("");
  const [notaMedia, setNotaMedia] = useState("");
  const [total, setTotal] = useState("");
  const [salvandoResumo, setSalvandoResumo] = useState(false);

  async function carregar() {
    try {
      setLista(await listarAvaliacoesManuais());
    } catch (error) {
      console.error(error);
      toast.error(
        "Não foi possível carregar as avaliações. Rodou a migração no Supabase?"
      );
    }
  }

  useEffect(() => {
    carregar();
    obterConfiguracoes().then((c) => {
      setPerfilUrl(c.google_perfil_url ?? "");
      setNotaMedia(c.google_nota_media ?? "");
      setTotal(c.google_total_avaliacoes ?? "");
    });
  }, []);

  async function adicionar() {
    if (!autor.trim() || !texto.trim()) {
      toast.error("Preencha o nome e o texto da avaliação.");
      return;
    }
    setSalvando(true);
    try {
      await criarAvaliacaoManual({
        autor: autor.trim(),
        nota: Number(nota),
        texto: texto.trim(),
        tempo_relativo: quando.trim(),
      });
      setAutor("");
      setTexto("");
      setQuando("");
      setNota("5");
      await carregar();
      toast.success("Avaliação adicionada!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta avaliação?")) return;
    try {
      await excluirAvaliacaoManual(id);
      await carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir.");
    }
  }

  async function salvarResumo() {
    setSalvandoResumo(true);
    try {
      await salvarConfiguracao("google_perfil_url", perfilUrl.trim());
      await salvarConfiguracao("google_nota_media", notaMedia.trim());
      await salvarConfiguracao("google_total_avaliacoes", total.trim());
      toast.success("Resumo salvo!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvandoResumo(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="font-display text-xl font-bold text-navy">
        Avaliações do Google (cadastro manual)
      </h2>

      <p className="mt-2 font-sans text-sm text-slate-500">
        Copie do perfil da Dunna no Google as avaliações que quer exibir
        no site (nome, nota e texto exatamente como estão lá). Enquanto
        houver avaliações aqui, o site usa elas e não precisa da
        integração com a API do Google.
      </p>

      {/* Resumo do perfil */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">

        <div className="md:col-span-3">
          <label className={labelClass}>Link do perfil no Google</label>
          <input
            value={perfilUrl}
            onChange={(e) => setPerfilUrl(e.target.value)}
            placeholder="https://www.google.com/maps/place/..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Nota média no Google</label>
          <input
            value={notaMedia}
            onChange={(e) => setNotaMedia(e.target.value)}
            placeholder="Ex: 5.0"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Total de avaliações no Google</label>
          <input
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Ex: 32"
            className={inputClass}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={salvarResumo}
            disabled={salvandoResumo}
            className="w-full rounded-xl border border-slate-200 px-6 py-3 font-sans font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {salvandoResumo ? "Salvando..." : "Salvar resumo"}
          </button>
        </div>

      </div>

      <p className="mt-2 font-sans text-xs text-slate-400">
        Nota média e total são opcionais: se ficarem vazios, o site
        calcula a partir das avaliações cadastradas abaixo.
      </p>

      {/* Nova avaliação */}

      <div className="mt-8 border-t border-slate-100 pt-6">

        <p className="font-sans font-semibold text-navy">Nova avaliação</p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <div>
            <label className={labelClass}>Nome do cliente</label>
            <input
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Nota</label>
            <select
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className={inputClass}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "estrela" : "estrelas"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Quando (opcional)</label>
            <input
              value={quando}
              onChange={(e) => setQuando(e.target.value)}
              placeholder="Ex: há 2 meses"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Texto da avaliação</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={4}
              className={inputClass}
            />
          </div>

        </div>

        <button
          onClick={adicionar}
          disabled={salvando}
          className="mt-4 flex items-center gap-2 rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
        >
          <Plus size={18} />
          {salvando ? "Salvando..." : "Adicionar avaliação"}
        </button>

      </div>

      {/* Lista */}

      <div className="mt-8 space-y-3">

        {lista.length === 0 && (
          <p className="font-sans text-sm text-slate-400">
            Nenhuma avaliação cadastrada ainda.
          </p>
        )}

        {lista.map((a) => (
          <div
            key={a.id}
            className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4"
          >
            <div className="min-w-0">
              <p className="font-sans font-semibold text-navy">
                {a.autor}{" "}
                <span className="ml-2 inline-flex items-center gap-1 text-sm font-normal text-gold">
                  <Star size={14} className="fill-gold" />
                  {a.nota}
                </span>
                {a.tempo_relativo && (
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    {a.tempo_relativo}
                  </span>
                )}
              </p>
              <p className="mt-1 line-clamp-3 font-sans text-sm text-slate-600">
                {a.texto}
              </p>
            </div>

            <button
              onClick={() => excluir(a.id)}
              aria-label="Excluir avaliação"
              className="shrink-0 text-slate-400 transition hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}
