"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { MapPin, Pencil, Trash2, Link2, MessageCircle, Mail } from "lucide-react";
import {
  buscarImovel,
  excluirImovel,
  listarFotosImovel,
} from "../services/imoveis.service";
import { Imovel, ImovelFoto } from "../types/imovel";
import BotaoBaixarFotos from "@/components/shared/BotaoBaixarFotos";

interface Props {
  id: string;
}

function formatarPreco(valor: number | null) {
  if (!valor) return "—";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function ImovelDetalhesPage({ id }: Props) {
  const router = useRouter();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [fotos, setFotos] = useState<ImovelFoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    Promise.all([buscarImovel(id), listarFotosImovel(id)])
      .then(([imovelData, fotosData]) => {
        setImovel(imovelData);
        setFotos(fotosData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleExcluir() {
    if (!imovel) return;

    const confirmado = window.confirm(
      `Tem certeza que deseja excluir "${imovel.titulo}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    setExcluindo(true);

    try {
      await excluirImovel(id);
      toast.success("Imóvel excluído.");
      router.push("/imoveis");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir o imóvel.");
    } finally {
      setExcluindo(false);
    }
  }

  if (loading) {
    return <p className="font-sans text-slate-400">Carregando...</p>;
  }

  if (!imovel) {
    return (
      <div>
        <p className="font-sans text-slate-500">Imóvel não encontrado.</p>
        <Link href="/imoveis" className="mt-4 inline-block font-sans text-gold">
          ← Voltar para Imóveis
        </Link>
      </div>
    );
  }

  const enderecoCompleto = [imovel.endereco, imovel.bairro, imovel.cidade]
    .filter(Boolean)
    .join(", ");

  const caracteristicas = [
    { label: "Quartos", valor: imovel.quartos },
    { label: "Suítes", valor: imovel.suites },
    { label: "Banheiros", valor: imovel.banheiros },
    { label: "Vagas", valor: imovel.vagas },
    {
      label: "Área privativa",
      valor: imovel.area_privativa ? `${imovel.area_privativa}m²` : null,
    },
    {
      label: "Área total",
      valor: imovel.area_total ? `${imovel.area_total}m²` : null,
    },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  const linkPublico = imovel.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/site/imoveis/${imovel.slug}`
    : null;

  function handleCopiarLink() {
    if (!linkPublico) return;
    navigator.clipboard.writeText(linkPublico);
    toast.success("Link copiado!");
  }

  function handleCompartilharWhatsApp() {
    if (!linkPublico) return;
    const texto = encodeURIComponent(
      `Olha esse imóvel: ${imovel?.titulo}\n${linkPublico}`
    );
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  }

  function handleCompartilharEmail() {
    if (!linkPublico) return;
    const assunto = encodeURIComponent(`Imóvel: ${imovel?.titulo}`);
    const corpo = encodeURIComponent(
      `Olá! Segue o link do imóvel:\n\n${linkPublico}`
    );
    window.open(`mailto:?subject=${assunto}&body=${corpo}`);
  }

  return (
    <div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <Link href="/imoveis" className="font-sans text-sm text-slate-500 hover:text-gold">
          ← Voltar para Imóveis
        </Link>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">

          {linkPublico && (
            <>
              <button
                onClick={handleCopiarLink}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-sans text-sm font-semibold text-navy transition hover:bg-slate-50 sm:text-base"
              >
                <Link2 size={16} />
                Copiar link
              </button>

              <button
                onClick={handleCompartilharWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 font-sans text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:text-base"
              >
                <MessageCircle size={16} />
                WhatsApp
              </button>

              <button
                onClick={handleCompartilharEmail}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-sans text-sm font-semibold text-navy transition hover:bg-slate-50 sm:text-base"
              >
                <Mail size={16} />
                E-mail
              </button>
            </>
          )}

          <BotaoBaixarFotos
            fotos={fotos.map((f) => f.url)}
            nomeArquivo={imovel.titulo}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-sans text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:opacity-60 sm:text-base"
          />

          <Link
            href={`/imoveis/${id}/editar`}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 font-sans text-sm font-semibold text-navy transition hover:bg-slate-50 sm:text-base"
          >
            <Pencil size={16} />
            Editar
          </Link>

          <button
            onClick={handleExcluir}
            disabled={excluindo}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 font-sans text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 sm:text-base"
          >
            <Trash2 size={16} />
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>

        </div>

      </div>

      {!imovel.publicado && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 font-sans text-sm text-amber-700">
          ⚠️ Este imóvel ainda não está publicado no site — o link só vai
          funcionar depois que você marcar "Publicar no site" na edição.
        </div>
      )}

      {/* Galeria */}

      {fotos.length > 0 ? (

        <div>

          <div
            className="h-96 w-full rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${fotos[fotoAtiva].url})` }}
          />

          {fotos.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">

              {fotos.map((foto, i) => (
                <button
                  key={foto.id}
                  onClick={() => setFotoAtiva(i)}
                  className={`h-20 w-28 shrink-0 rounded-xl bg-cover bg-center transition ${
                    i === fotoAtiva ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundImage: `url(${foto.url})` }}
                />
              ))}

            </div>
          )}

        </div>

      ) : (

        <div className="flex h-96 w-full items-center justify-center rounded-3xl bg-slate-100">
          <p className="font-sans text-slate-400">Sem fotos cadastradas</p>
        </div>

      )}

      {/* Título e status */}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          {imovel.selo && (
            <span className="rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-white">
              {imovel.selo}
            </span>
          )}

          <h1 className="mt-3 font-display text-2xl font-bold text-navy md:text-4xl">
            {imovel.titulo}
          </h1>

          {enderecoCompleto && (
            <p className="mt-2 flex items-center gap-2 font-sans text-slate-500">
              <MapPin size={16} className="shrink-0 text-gold" />
              {enderecoCompleto}
            </p>
          )}

        </div>

        <div className="sm:text-right">

          <p className="font-display text-2xl font-bold text-gold md:text-3xl">
            {formatarPreco(imovel.preco)}
          </p>

          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 font-sans text-sm font-medium text-slate-600">
            {imovel.publicado ? "Publicado no site" : "Rascunho"}
          </span>

        </div>

      </div>

      {/* Mapa */}

      {enderecoCompleto && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">

          <iframe
            title="Mapa do imóvel"
            width="100%"
            height="260"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              enderecoCompleto
            )}&output=embed`}
          />

        </div>
      )}

      {/* Características */}

      {caracteristicas.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-3">

          {caracteristicas.map((item) => (
            <div key={item.label}>
              <h3 className="font-display text-2xl font-bold text-navy">
                {item.valor}
              </h3>
              <p className="font-sans text-slate-500">
                {item.label}
              </p>
            </div>
          ))}

        </div>
      )}

      {/* Descrição */}

      {imovel.descricao && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="font-display text-xl font-bold text-navy">
            Descrição
          </h2>

          <p className="mt-4 whitespace-pre-line font-sans leading-8 text-slate-600">
            {imovel.descricao}
          </p>

        </div>
      )}

      {/* Valores adicionais */}

      {(imovel.condominio || imovel.iptu || imovel.comissao) && (
        <div className="mt-8 grid grid-cols-3 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          {imovel.condominio && (
            <div>
              <p className="font-sans text-slate-500">Condomínio</p>
              <p className="font-display text-xl font-bold text-navy">
                {formatarPreco(imovel.condominio)}
              </p>
            </div>
          )}

          {imovel.iptu && (
            <div>
              <p className="font-sans text-slate-500">
                IPTU ({imovel.iptu_periodicidade === "anual" ? "anual" : "mensal"})
              </p>
              <p className="font-display text-xl font-bold text-navy">
                {formatarPreco(imovel.iptu)}
              </p>
            </div>
          )}

          {imovel.comissao && (
            <div>
              <p className="font-sans text-slate-500">Comissão</p>
              <p className="font-display text-xl font-bold text-navy">
                {imovel.comissao}%
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
