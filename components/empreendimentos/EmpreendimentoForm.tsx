"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  DollarSign,
  Image,
  Globe,
  Check,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Informações",
    icon: Building2,
  },
  {
    id: 2,
    title: "Localização",
    icon: MapPin,
  },
  {
    id: 3,
    title: "Comercial",
    icon: DollarSign,
  },
  {
    id: 4,
    title: "Galeria",
    icon: Image,
  },
  {
    id: 5,
    title: "Publicação",
    icon: Globe,
  },
];

export default function EmpreendimentoForm() {
  const [step, setStep] = useState(1);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900">

      {/* Header */}

      <div className="border-b border-zinc-800 p-8">

        <h2 className="text-3xl font-bold">
          Novo Empreendimento
        </h2>

        <p className="mt-2 text-zinc-500">
          Cadastre um empreendimento em poucos passos.
        </p>

      </div>

      {/* Steps */}

      <div className="flex justify-between border-b border-zinc-800 px-10 py-8">

        {steps.map((item) => {

          const Icon = item.icon;

          const active = item.id === step;

          const completed = item.id < step;

          return (

            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className="flex flex-col items-center"
            >

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full transition
                ${
                  completed
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-[#C8A96A] text-black"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >

                {completed ? (
                  <Check size={22} />
                ) : (
                  <Icon size={22} />
                )}

              </div>

              <span
                className={`mt-3 text-sm ${
                  active
                    ? "text-[#C8A96A]"
                    : "text-zinc-500"
                }`}
              >
                {item.title}
              </span>

            </button>

          );
        })}

      </div>

      {/* Conteúdo */}

      <div className="p-10">

        {step === 1 && <Informacoes />}

        {step === 2 && <Localizacao />}

        {step === 3 && <Comercial />}

        {step === 4 && <Galeria />}

        {step === 5 && <Publicacao />}

      </div>

      {/* Footer */}

      <div className="flex justify-between border-t border-zinc-800 p-8">

        <button
          onClick={() => setStep(Math.max(step - 1, 1))}
          className="rounded-xl border border-zinc-700 px-6 py-3"
        >
          Voltar
        </button>

        <button
          onClick={() => setStep(Math.min(step + 1, 5))}
          className="rounded-xl bg-[#C8A96A] px-8 py-3 font-semibold text-black"
        >
          {step === 5 ? "Finalizar" : "Próximo"}
        </button>

      </div>

    </div>
  );
}

/* ---------- STEP 1 ---------- */

function Informacoes() {
  return (
    <div className="grid gap-6 md:grid-cols-2">

      <Input label="Nome do Empreendimento" />

      <Input label="Construtora" />

      <Input label="Cidade" />

      <Input label="Bairro" />

      <Input label="Região" />

      <Input label="CEP" />

      <Input label="Tipo de Imóvel" />

      <Input label="Número de Torres" />

      <Input label="Número de Pavimentos" />

      <Input label="Total de Unidades" />

      <Input label="Área Privativa (m²)" />

      <Input label="Entrega Prevista" />

    </div>
  );
}

/* ---------- STEP 2 ---------- */

function Localizacao() {
  return (
    <div className="space-y-6">

      <Input label="Endereço" />

      <Input label="Google Maps" />

    </div>
  );
}

/* ---------- STEP 3 ---------- */

function Comercial() {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      <Input label="Preço Inicial" />

      <Input label="Preço Máximo" />

      <Input label="VGV" />

      <Input label="Comissão (%)" />

      <Input label="Valor da Comissão" />

      <Input label="Entrada" />

      <Input label="Parcelamento" />

      <Input label="Financiamento" />

      <Input label="Entrega das Chaves" />

    </div>
  );
}

/* ---------- STEP 4 ---------- */

function Galeria() {
  return (
    <div className="space-y-6">

      <div className="rounded-3xl border-2 border-dashed border-[#C8A96A]/30 bg-zinc-950 p-16 text-center">

        <h3 className="text-xl font-semibold">
          Upload de Imagens
        </h3>

        <p className="mt-3 text-zinc-500">
          Arraste imagens ou clique para selecionar.
        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-4">

        {[1,2,3,4].map((item)=>(

          <div
            key={item}
            className="aspect-square rounded-2xl border border-zinc-800 bg-zinc-900"
          />

        ))}

      </div>

    </div>
  );
}

/* ---------- STEP 5 ---------- */

function Publicacao() {
  return (
    <div className="space-y-8">

      <label className="flex items-center justify-between rounded-2xl border border-zinc-800 p-5">

        <div>

          <h3 className="font-semibold">
            Publicar no Site
          </h3>

          <p className="text-sm text-zinc-500">
            Disponibiliza o empreendimento no portal.
          </p>

        </div>

        <input type="checkbox" />

      </label>

      <label className="flex items-center justify-between rounded-2xl border border-zinc-800 p-5">

        <div>

          <h3 className="font-semibold">
            Empreendimento em Destaque
          </h3>

          <p className="text-sm text-zinc-500">
            Exibe na página inicial do site.
          </p>

        </div>

        <input type="checkbox" />

      </label>

      <label className="flex items-center justify-between rounded-2xl border border-zinc-800 p-5">

        <div>

          <h3 className="font-semibold">
            Permitir Captação de Leads
          </h3>

          <p className="text-sm text-zinc-500">
            Exibe formulário de contato no empreendimento.
          </p>

        </div>

        <input type="checkbox" />

      </label>

    </div>
  );
}

/* ---------- INPUT ---------- */

function Input({
  label,
}: {
  label: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 outline-none focus:border-[#C8A96A]"
      />

    </div>
  );
}