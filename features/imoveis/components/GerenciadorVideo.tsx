"use client";

import { Film, Trash2, Upload } from "lucide-react";

interface Props {
  // Se já existe um vídeo salvo (URL) ou escolhido agora (objectURL
  // do arquivo local, antes do upload) — os dois usam o mesmo player.
  previewUrl: string | null;
  onAdicionar: (arquivo: File | null) => void;
  onRemover: () => void;
}

// Limite alinhado ao tamanho máximo configurado no bucket "imoveis"
// do Supabase Storage — ver migração 20260728_video_imoveis.sql.
const TAMANHO_MAXIMO_MB = 200;

export default function GerenciadorVideo({
  previewUrl,
  onAdicionar,
  onRemover,
}: Props) {
  function handleArquivo(files: FileList | null) {
    const arquivo = files?.[0] ?? null;

    if (arquivo && arquivo.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
      alert(
        `Esse vídeo tem mais de ${TAMANHO_MAXIMO_MB}MB. Tenta comprimir ou cortar antes de enviar.`
      );
      return;
    }

    onAdicionar(arquivo);
  }

  if (previewUrl) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <video
          src={previewUrl}
          controls
          className="max-h-96 w-full bg-black"
        />

        <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
          <span className="flex items-center gap-2 font-sans text-sm text-slate-500">
            <Film size={16} />
            Vídeo do imóvel
          </span>

          <button
            type="button"
            onClick={onRemover}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-sans text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={14} />
            Remover
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-8 font-sans text-slate-500 transition hover:border-gold hover:text-gold">
      <Upload size={20} />
      Clique para escolher o vídeo
      <span className="font-sans text-xs text-slate-400">
        MP4 ou MOV, até {TAMANHO_MAXIMO_MB}MB
      </span>
      <input
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => handleArquivo(e.target.files)}
      />
    </label>
  );
}
