"use client";

import { useState } from "react";
import { ImagePlus, MapPinned } from "lucide-react";

import ImageUploader from "../components/ImageUploader";
import { uploadImagem } from "../services/upload.service";

export default function StepMidias() {
  const [imagens, setImagens] = useState<string[]>([]);
  const [video, setVideo] = useState("");
  const [tour360, setTour360] = useState("");

  async function selecionar(files: FileList) {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadImagem("TEMP", file);
      urls.push(url);
    }

    setImagens((old) => [...old, ...urls]);
  }

  return (
    <div className="space-y-10">

      <div>

        <h2 className="text-2xl font-bold text-white">
          Mídias
        </h2>

        <p className="mt-2 text-zinc-500">
          Faça upload das imagens e informe os links do vídeo e do tour virtual.
        </p>

      </div>

      <ImageUploader onSelect={selecionar} />

      {imagens.length > 0 && (
        <div className="grid grid-cols-4 gap-5">

          {imagens.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              className="aspect-square rounded-2xl object-cover"
            />
          ))}

        </div>
      )}

      <div>

        <label className="mb-3 block text-sm text-zinc-400">
          Vídeo (YouTube)
        </label>

        <input
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          placeholder="https://youtube.com/..."
          className="h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 text-white"
        />

      </div>

      <div>

        <label className="mb-3 block text-sm text-zinc-400">
          Tour 360°
        </label>

        <input
          value={tour360}
          onChange={(e) => setTour360(e.target.value)}
          placeholder="https://..."
          className="h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 text-white"
        />

      </div>

      <div>

        <label className="mb-3 block text-sm text-zinc-400">
          Localização
        </label>

        <div className="flex h-72 items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-950">

          <div className="text-center">

            <MapPinned
              size={46}
              className="mx-auto text-zinc-500"
            />

            <p className="mt-4 text-zinc-500">
              Integração com Google Maps será adicionada.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}