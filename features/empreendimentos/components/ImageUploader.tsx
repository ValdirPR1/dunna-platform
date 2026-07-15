"use client";

import { ImagePlus } from "lucide-react";

interface Props {
  onSelect: (files: FileList) => void;
}

export default function ImageUploader({
  onSelect,
}: Props) {
  return (
    <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-950 transition hover:border-[#C8A96A]">

      <ImagePlus
        size={54}
        className="text-[#C8A96A]"
      />

      <p className="mt-6 text-lg font-semibold text-white">
        Arraste imagens aqui
      </p>

      <p className="mt-2 text-zinc-500">
        ou clique para selecionar
      </p>

      <input
        multiple
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onSelect(e.target.files);
          }
        }}
      />

    </label>
  );
}