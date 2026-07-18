"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { criarLandingPage } from "../services/landingpages.service";
import { listarEmpreendimentos } from "@/features/empreendimentos/services/empreendimentos.service";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onCriada: () => void;
}

export default function NovaLandingPageModal({
  aberto,
  onFechar,
  onCriada,
}: Props) {
  const router = useRouter();

  const [empreendimentos, setEmpreendimentos] = useState<any[]>([]);
  const [empreendimentoId, setEmpreendimentoId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    listarEmpreendimentos().then(({ data }) => {
      setEmpreendimentos(data ?? []);
    });
  }, [aberto]);

  if (!aberto) return null;

  async function salvar() {
    if (!empreendimentoId || !titulo) {
      toast.error("Escolha o empreendimento e dê um título pra landing page.");
      return;
    }

    setSalvando(true);

    try {
      const pagina = await criarLandingPage({
        empreendimento_id: empreendimentoId,
        titulo,
        headline,
        subheadline,
        video_url: videoUrl,
      });

      toast.success("Landing page criada!");
      onCriada();
      onFechar();
      router.push(`/landing-pages/${pagina.id}/editar`);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível criar a landing page.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl"
      >

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-navy">
            Nova Landing Page
          </h2>
          <button onClick={onFechar}>
            <X size={20} className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <div className="mt-6 space-y-4">

          <select
            value={empreendimentoId}
            onChange={(e) => setEmpreendimentoId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          >
            <option value="">Selecione o empreendimento</option>
            {empreendimentos.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nome}
              </option>
            ))}
          </select>

          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Nome interno (só pra você identificar, ex: Campanha Julho)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Chamada principal (ex: Seu apê na praia dos sonhos)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            placeholder="Subtítulo (ex: Últimas unidades disponíveis)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Link do vídeo (YouTube ou MP4, opcional)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold"
          />

          <button
            onClick={salvar}
            disabled={salvando}
            className="w-full rounded-xl bg-navy py-4 font-sans font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
          >
            {salvando ? "Criando..." : "Criar e continuar editando"}
          </button>

        </div>

      </div>
    </div>
  );
}
