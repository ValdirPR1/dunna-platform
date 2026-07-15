"use client";

import {
  Globe,
  Star,
  Power,
} from "lucide-react";

interface Props {
  empreendimento: any;
}

export default function PublishPanel({
  empreendimento,
}: Props) {

  return (

    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Publicação
          </h2>

          <p className="mt-2 text-zinc-500">
            Controle onde este empreendimento será exibido.
          </p>

        </div>

      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">

        <Botao
          ativo={empreendimento.publicado}
          titulo="Site"
          descricao="Publicado"
          icon={<Globe size={22} />}
        />

        <Botao
          ativo={empreendimento.destaque}
          titulo="Home"
          descricao="Destaque"
          icon={<Star size={22} />}
        />

        <Botao
          ativo={empreendimento.ativo}
          titulo="Sistema"
          descricao="Ativo"
          icon={<Power size={22} />}
        />

      </div>

    </section>

  );

}

function Botao({
  ativo,
  titulo,
  descricao,
  icon,
}:{
  ativo:boolean;
  titulo:string;
  descricao:string;
  icon:React.ReactNode;
}){

  return(

    <button
      className={`
        rounded-2xl
        border
        p-6
        text-left
        transition

        ${
          ativo
          ? "border-[#C8A96A] bg-[#C8A96A]/10"
          : "border-zinc-800 bg-zinc-950"
        }
      `}
    >

      <div className="text-[#C8A96A]">

        {icon}

      </div>

      <h3 className="mt-5 text-xl font-bold text-white">

        {titulo}

      </h3>

      <p className="mt-2 text-zinc-500">

        {descricao}

      </p>

    </button>

  )

}