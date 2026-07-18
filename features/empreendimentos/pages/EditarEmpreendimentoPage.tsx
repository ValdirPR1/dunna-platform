"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import EmpreendimentoWizard from "../forms/EmpreendimentoWizard";

import { buscarEmpreendimento } from "../services/empreendimentos.service";

export default function EditarEmpreendimentoPage() {

  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [dados, setDados] = useState<any>(null);
  const [comodidades, setComodidades] = useState<string[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    try {

      const { data: empreendimento } =
        await buscarEmpreendimento(
          params.id as string
        );

      if (!empreendimento) return;

      setComodidades(empreendimento.comodidades ?? []);

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
        areaFinal: String(
          empreendimento.area_final ?? ""
        ),
        vgv: String(
          empreendimento.vgv ?? ""
        ),
        localizacaoTexto: empreendimento.localizacao_texto ?? "",
        valorizacaoTexto: empreendimento.valorizacao_texto ?? "",
        descricao: empreendimento.descricao ?? "",
        publicado: empreendimento.publicado ?? false,
      });

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center text-slate-400">

        Carregando empreendimento...

      </div>

    );

  }

  return (

    <main className="mx-auto max-w-7xl p-8">

      <h1 className="mb-8 font-display text-3xl font-bold text-navy">
        Editar Empreendimento
      </h1>

      <EmpreendimentoWizard
        modo="editar"
        empreendimentoId={params.id as string}
        initialData={dados}
        comodidadesIniciais={comodidades}
      />

    </main>

  );

}
