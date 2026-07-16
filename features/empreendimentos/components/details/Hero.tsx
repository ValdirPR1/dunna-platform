"use client";

import {
  Building2,
  MapPin,
  BadgeDollarSign,
  Home,
} from "lucide-react";

import { Empreendimento } from "@/types/empreendimento";

interface Props {
  empreendimento: Empreendimento;
}

export default function Hero({
  empreendimento,
}: Props) {

  return (

    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

      <div className="relative flex h-80 items-center justify-center bg-zinc-800">

        <span className="text-zinc-500">
          Imagem de Capa
        </span>

        <div className="absolute right-6 top-6 flex gap-3">

          <Status
            cor={
              empreendimento.ativo
                ? "bg-green-500"
                : "bg-red-500"
            }
            texto={
              empreendimento.ativo
                ? "Ativo"
                : "Inativo"
            }
          />

          <Status
            cor={
              empreendimento.publicado
                ? "bg-blue-500"
                : "bg-zinc-600"
            }
            texto={
              empreendimento.publicado
                ? "Publicado"
                : "Não Publicado"
            }
          />

          <Status
            cor={
              empreendimento.destaque
                ? "bg-yellow-500"
                : "bg-zinc-600"
            }
            texto={
              empreendimento.destaque
                ? "Destaque"
                : "Normal"
            }
          />

        </div>

      </div>

      <div className="space-y-8 p-8">

        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-4xl font-bold text-white">

              {empreendimento.nome}

            </h1>

            <div className="mt-4 flex flex-wrap gap-6 text-zinc-400">

              <Info
                icon={<MapPin size={18} />}
                valor={`${empreendimento.bairro} • ${empreendimento.cidade}`}
              />

              <Info
                icon={<Building2 size={18} />}
                valor={empreendimento.construtora}
              />

            </div>

          </div>

          <div className="text-right">

            <p className="text-sm text-zinc-500">
              Status Comercial
            </p>

            <h3 className="mt-2 text-2xl font-bold text-[#C8A96A]">
              {empreendimento.status}
            </h3>

          </div>

        </div>

        <div className="grid grid-cols-4 gap-5">

          <Card
            titulo="Valor Inicial"
            valor={Number(
              empreendimento.valorInicial || 0
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={<BadgeDollarSign size={22} />}
          />

          <Card
            titulo="Valor Final"
            valor={Number(
              empreendimento.valorFinal || 0
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={<BadgeDollarSign size={22} />}
          />

          <Card
            titulo="Área"
            valor={`${empreendimento.areaMin} m²`}
            icon={<Home size={22} />}
          />

          <Card
            titulo="VGV"
            valor={Number(
              empreendimento.vgv || 0
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={<Building2 size={22} />}
          />

        </div>

      </div>

    </section>

  );

}

function Status({
  cor,
  texto,
}: {
  cor: string;
  texto: string;
}) {

  return (

    <div className="flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2">

      <div className={`h-2.5 w-2.5 rounded-full ${cor}`} />

      <span className="text-sm text-white">

        {texto}

      </span>

    </div>

  );

}

function Info({
  icon,
  valor,
}: {
  icon: React.ReactNode;
  valor: string;
}) {

  return (

    <div className="flex items-center gap-2">

      {icon}

      <span>{valor}</span>

    </div>

  );

}

function Card({
  titulo,
  valor,
  icon,
}: {
  titulo: string;
  valor: string;
  icon: React.ReactNode;
}) {

  return (

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

      <div className="mb-4 text-[#C8A96A]">

        {icon}

      </div>

      <p className="text-sm text-zinc-500">

        {titulo}

      </p>

      <strong className="mt-2 block text-xl text-white">

        {valor}

      </strong>

    </div>

  );

}