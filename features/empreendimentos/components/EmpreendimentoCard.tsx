"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  DollarSign,
} from "lucide-react";

import { Empreendimento } from "@/types/empreendimento";

interface Props {
  empreendimento: Empreendimento;
  onDelete?: (id: string) => void;
}

export default function EmpreendimentoCard({
  empreendimento,
  onDelete,
}: Props) {

  const router = useRouter();

  function excluir() {

    const confirmar = window.confirm(
      `Deseja excluir "${empreendimento.nome}"?`
    );

    if (!confirmar) return;

    onDelete?.(empreendimento.id);

  }

  return (

    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A96A]">

      <div className="relative h-56 bg-zinc-800">

        {empreendimento.capa ? (

          <Image
            src={empreendimento.capa}
            alt={empreendimento.nome}
            fill
            className="object-cover"
          />

        ) : (

          <div className="flex h-full items-center justify-center">

            <Building2
              size={60}
              className="text-zinc-600"
            />

          </div>

        )}

        <div className="absolute right-4 top-4 rounded-full bg-[#C8A96A] px-4 py-2 text-xs font-semibold text-black">

          {empreendimento.status}

        </div>

      </div>

      <div className="space-y-5 p-6">

        <div>

          <h2 className="text-2xl font-bold text-white">

            {empreendimento.nome}

          </h2>

          <div className="mt-2 flex items-center gap-2 text-zinc-400">

            <MapPin size={16} />

            {empreendimento.bairro} • {empreendimento.cidade}

          </div>

        </div>

        <div className="flex items-center gap-2 text-[#C8A96A]">

          <DollarSign size={18} />

          <strong>

            A partir de{" "}
            {Number(
              empreendimento.valorInicial || 0
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}

          </strong>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <Info
            titulo="VGV"
            valor={Number(
              empreendimento.vgv || 0
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          />

          <Info
            titulo="Cidade"
            valor={empreendimento.cidade}
          />

        </div>

        <div className="flex gap-3 pt-3">

          <button
            onClick={() =>
              router.push(
                `/empreendimentos/${empreendimento.id}`
              )
            }
            className="flex-1 rounded-xl border border-zinc-700 py-3 text-white transition hover:bg-zinc-800"
          >

            <Eye className="mx-auto" size={18} />

          </button>

          <button
            onClick={() =>
              router.push(
                `/empreendimentos/${empreendimento.id}/editar`
              )
            }
            className="flex-1 rounded-xl bg-[#C8A96A] py-3 text-black transition hover:brightness-110"
          >

            <Pencil className="mx-auto" size={18} />

          </button>

          <button
            onClick={excluir}
            className="flex-1 rounded-xl border border-red-500/30 py-3 text-red-400 transition hover:bg-red-500/10"
          >

            <Trash2 className="mx-auto" size={18} />

          </button>

        </div>

      </div>

    </div>

  );

}

function Info({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {

  return (

    <div className="rounded-2xl bg-zinc-950 p-4">

      <p className="text-xs text-zinc-500">

        {titulo}

      </p>

      <strong className="mt-1 block text-white">

        {valor}

      </strong>

    </div>

  );

}