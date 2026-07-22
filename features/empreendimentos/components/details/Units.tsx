"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Trash2, Search, Home, ExternalLink } from "lucide-react";
import NovaUnidadeModal from "@/features/unidades/components/NovaUnidadeModal";
import ImportarUnidadesPdfModal from "@/features/unidades/components/ImportarUnidadesPdfModal";
import {
  excluirUnidade,
  listarUnidades,
  criarAnuncioComUnidade,
} from "@/features/unidades/services/unidade.service";
import {
  EmpreendimentoResumo,
  Unidade,
} from "@/features/unidades/types/unidade";

interface Props {
  empreendimento: EmpreendimentoResumo;
}

function formatarPreco(valor: number | null) {
  if (!valor) return "—";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function Units({ empreendimento }: Props) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [busca, setBusca] = useState("");
  const [criandoAnuncio, setCriandoAnuncio] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [excluindoTodas, setExcluindoTodas] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listarUnidades(empreendimento.id);
      setUnidades(data as Unidade[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [empreendimento.id]);

  const unidadesFiltradas = unidades.filter((u) => {
    if (!busca.trim()) return true;

    const termo = busca.trim().toLowerCase();

    return [u.numero, u.torre, u.bloco, u.status, u.tipologia]
      .filter(Boolean)
      .some((campo) => String(campo).toLowerCase().includes(termo));
  });

  async function handleCriarAnuncio(unidadeId: string) {
    setCriandoAnuncio(unidadeId);

    try {
      const imovelId = await criarAnuncioComUnidade(unidadeId);
      toast.success("Anúncio criado com sucesso!");
      carregar();
      router.push(`/imoveis/${imovelId}/editar`);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível criar o anúncio.");
    } finally {
      setCriandoAnuncio(null);
    }
  }

  async function handleExcluir(unidadeId: string, numero: string) {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir a unidade "${numero}"?`
    );

    if (!confirmado) return;

    try {
      await excluirUnidade(unidadeId);
      toast.success("Unidade excluída.");
      carregar();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir a unidade.");
    }
  }

  async function handleExcluirTodas() {
    if (unidades.length === 0) return;

    const confirmado = window.confirm(
      `Tem certeza que deseja excluir TODAS as ${unidades.length} unidades deste empreendimento? Essa ação não pode ser desfeita.`
    );

    if (!confirmado) return;

    // Segunda confirmação, já que é uma exclusão em massa e irreversível
    const digitado = window.prompt(
      `Pra confirmar de verdade, digite EXCLUIR (em maiúsculas):`
    );

    if (digitado !== "EXCLUIR") {
      toast("Exclusão cancelada.");
      return;
    }

    setExcluindoTodas(true);

    let sucesso = 0;
    let falhas = 0;

    for (const unidade of unidades) {
      try {
        await excluirUnidade(unidade.id);
        sucesso++;
      } catch (error) {
        console.error("Erro ao excluir unidade", unidade.id, error);
        falhas++;
      }
    }

    setExcluindoTodas(false);

    toast.success(`${sucesso} unidade(s) excluída(s).`);
    if (falhas > 0) {
      toast.error(`${falhas} unidade(s) não puderam ser excluídas.`);
    }

    carregar();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="font-display text-2xl font-bold text-navy">
            Unidades
          </h2>

          <p className="mt-1 font-sans text-slate-500">
            Unidades cadastradas neste empreendimento.
          </p>
        </div>

        <div className="flex gap-2">

          {unidades.length > 0 && (
            <button
              onClick={handleExcluirTodas}
              disabled={excluindoTodas}
              className="rounded-xl border border-red-200 px-5 py-3 font-sans font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {excluindoTodas ? "Excluindo..." : "Excluir Todas"}
            </button>
          )}

          <button
            onClick={() => setOpenImportModal(true)}
            className="rounded-xl border border-slate-200 px-5 py-3 font-sans font-semibold text-navy transition hover:bg-slate-50"
          >
            Importar PDF
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-gold px-5 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark"
          >
            + Nova Unidade
          </button>

        </div>

      </div>

      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por número, torre, bloco, status ou tipologia..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 font-sans text-navy outline-none focus:border-gold"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Número</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Torre/Bloco</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Área</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Quartos</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Preço</th>
              <th className="px-5 py-4 text-left font-sans text-slate-500">Status</th>
              <th className="px-5 py-4 text-center font-sans text-slate-500">Ações</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center font-sans text-slate-400">
                  Carregando...
                </td>
              </tr>
            ) : unidadesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center font-sans text-slate-400">
                  {unidades.length === 0
                    ? "Nenhuma unidade cadastrada."
                    : "Nenhuma unidade encontrada com essa busca."}
                </td>
              </tr>
            ) : (
              unidadesFiltradas.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-sans text-navy">{u.numero}</td>
                  <td className="px-5 py-4 font-sans text-navy">
                    {u.torre || u.bloco
                      ? [u.torre, u.bloco].filter(Boolean).join(" / ")
                      : "—"}
                  </td>
                  <td className="px-5 py-4 font-sans text-navy">{u.area ? `${u.area}m²` : "—"}</td>
                  <td className="px-5 py-4 font-sans text-navy">{u.quartos ?? "—"}</td>
                  <td className="px-5 py-4 font-sans text-navy">{formatarPreco(u.preco)}</td>
                  <td className="px-5 py-4 font-sans text-navy">{u.status}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">

                      {u.imovel_id ? (
                        <Link
                          href={`/imoveis/${u.imovel_id}`}
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-sans text-xs font-semibold text-gold hover:bg-gold/10"
                        >
                          <ExternalLink size={13} />
                          Ver Anúncio
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleCriarAnuncio(u.id)}
                          disabled={criandoAnuncio === u.id}
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-sans text-xs font-semibold text-navy hover:bg-slate-100 disabled:opacity-50"
                        >
                          <Home size={13} />
                          {criandoAnuncio === u.id
                            ? "Criando..."
                            : "Criar Anúncio"}
                        </button>
                      )}

                      <button
                        onClick={() => handleExcluir(u.id, u.numero)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        aria-label="Excluir unidade"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      <NovaUnidadeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSaved={carregar}
        empreendimentoFixo={empreendimento}
      />

      <ImportarUnidadesPdfModal
        aberto={openImportModal}
        empreendimentoId={empreendimento.id}
        onFechar={() => setOpenImportModal(false)}
        onImportado={carregar}
      />

    </section>
  );
}
