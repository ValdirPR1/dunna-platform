"use client";

import { Building2, MapPin } from "lucide-react";
import { Empreendimento } from "@/types/empreendimento";

interface Props {
  empreendimento: Empreendimento;
}

export default function Hero({
  empreendimento,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

      <div className="h-72 bg-zinc-800 flex items-center justify-center">

        <span className="text-zinc-500">
          Imagem de Capa
        </span>

      </div>

      <div className="p-8">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">

              {empreendimento.nome}

            </h1>

            <div className="mt-3 flex items-center gap-5 text-zinc-400">

              <div className="flex items-center gap-2">

                <MapPin size={18} />

                {empreendimento.bairro} • {empreendimento.cidade}

              </div>

              <div className="flex items-center gap-2">

                <Building2 size={18} />

                {empreendimento.construtora}

              </div>

            </div>

          </div>

          <div>

            <span className="rounded-full bg-green-600/20 px-5 py-2 text-green-400">

              {empreendimento.status}

            </span>

          </div>

        </div>

      </div>

    </section>
  );
}