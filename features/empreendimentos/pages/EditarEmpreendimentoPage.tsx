"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import EmpreendimentoWizard from "../components/EmpreendimentoWizard";

import { buscarEmpreendimento } from "../services/empreendimentos.service";

export default function EditarEmpreendimentoPage() {

  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    try {

      const empreendimento =
        await buscarEmpreendimento(
          params.id as string
        );

      setDados({
        nome: empreendimento.nome ?? "",
        cidade: empreendimento.cidade ?? "",
        bairro: empreendimento.bairro ?? "",
        estado: empreendimento.estado ?? "",
        cep: empreendimento.cep ?? "",
        endereco: empreendimento.endereco ?? "",
        latitude: empreendimento.latitude ?? "",
        longitude: empreendimento.longitude ?? "",
        construtora: empreendimento.construtora ?? "",
        incorporadora: empreendimento.incorporadora ?? "",
        tipo: empreendimento.tipo ?? "",
        status: empreendimento.status ?? "Lançamento",
        entrega: empreendimento.entrega ?? "",
        registro: empreendimento.registro ?? "",
        valorInicial: String(
          empreendimento.valor_inicial ?? ""
        ),
        valorFinal: String(
          empreendimento.valor_final ?? ""
        ),
        areaInicial: String(
          empreendimento.area_inicial ?? ""
        ),
        areaFinal: String(
          empreendimento.area_final ?? ""
        ),
        vgv: String(
          empreendimento.vgv ?? ""
        ),
        descricao: empreendimento.descricao ?? "",
        diferenciais:
          empreendimento.diferenciais ?? "",
        infraestrutura:
          empreendimento.infraestrutura ?? "",
        lazer:
          empreendimento.lazer ?? "",
        publico:
          empreendimento.publico ?? "",
      });

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center text-zinc-400">

        Carregando empreendimento...

      </div>

    );

  }

  return (

    <main className="mx-auto max-w-7xl p-8">

      <EmpreendimentoWizard
        modo="editar"
        empreendimentoId={params.id as string}
        initialData={dados}
      />

    </main>

  );

}