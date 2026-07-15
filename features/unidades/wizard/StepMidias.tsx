"use client";

import { ImagePlus, Video, FileImage } from "lucide-react";

export default function StepMidias() {
  return (
    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-bold text-white">
          Mídias da Unidade
        </h2>

        <p className="mt-2 text-zinc-500">
          Fotos, planta baixa e vídeo desta unidade.
        </p>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <Card
          titulo="Fotos"
          descricao="Galeria da unidade."
          icon={<ImagePlus size={34} />}
        />

        <Card
          titulo="Planta"
          descricao="Imagem da planta baixa."
          icon={<FileImage size={34} />}
        />

        <Card
          titulo="Vídeo"
          descricao="Link do YouTube."
          icon={<Video size={34} />}
        />

      </div>

      <div>

        <label className="mb-2 block text-sm text-zinc-400">
          Tour Virtual
        </label>

        <input
          placeholder="https://..."
          className="h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 text-white"
        />

      </div>

    </div>
  );
}

function Card({
  titulo,
  descricao,
  icon,
}:{
  titulo:string;
  descricao:string;
  icon:React.ReactNode;
}){

  return(

    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">

        {icon}

      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">
        {titulo}
      </h3>

      <p className="mt-2 text-sm leading-7 text-zinc-500">
        {descricao}
      </p>

      <button
        className="mt-8 h-12 w-full rounded-xl bg-[#C8A96A] font-semibold text-black hover:brightness-110"
      >
        Selecionar
      </button>

    </div>

  )

}