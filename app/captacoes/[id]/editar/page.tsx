"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Upload, X, ArrowRightCircle, Home } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CampoMoeda from "@/components/ui/form/CampoMoeda";
import {
  buscarCaptacao,
  atualizarCaptacao,
  listarFotosCaptacao,
  uploadFotoCaptacao,
  excluirFotoCaptacao,
  converterEmAnuncio,
  STATUS_CAPTACAO,
} from "@/features/captacoes/services/captacoes.service";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-navy outline-none focus:border-gold";
const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function EditarCaptacaoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [convertendo, setConvertendo] = useState(false);
  const [imovelId, setImovelId] = useState<string | null>(null);

  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [fotosExistentes, setFotosExistentes] = useState<
    { id: string; url: string }[]
  >([]);
  const [fotosNovas, setFotosNovas] = useState<
    { key: string; file: File; url: string }[]
  >([]);

  const [form, setForm] = useState({
    titulo: "",
    tipo: "Apartamento",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    quartos: "",
    suites: "",
    banheiros: "",
    vagas: "",
    area_privativa: "",
    proprietario_nome: "",
    proprietario_telefone: "",
    proprietario_email: "",
    valor_pretendido: "",
    condicoes: "",
    observacoes: "",
    status: "Em avaliação",
    corretor_id: "",
    data_vistoria: "",
  });

  useEffect(() => {
    listarCorretoresAtivos().then(setCorretores);

    buscarCaptacao(id).then((c) => {
      if (!c) return;

      setImovelId(c.imovel_id);
      setForm({
        titulo: c.titulo ?? "",
        tipo: c.tipo ?? "Apartamento",
        endereco: c.endereco ?? "",
        bairro: c.bairro ?? "",
        cidade: c.cidade ?? "",
        estado: c.estado ?? "",
        cep: c.cep ?? "",
        quartos: c.quartos ? String(c.quartos) : "",
        suites: c.suites ? String(c.suites) : "",
        banheiros: c.banheiros ? String(c.banheiros) : "",
        vagas: c.vagas ? String(c.vagas) : "",
        area_privativa: c.area_privativa ? String(c.area_privativa) : "",
        proprietario_nome: c.proprietario_nome ?? "",
        proprietario_telefone: c.proprietario_telefone ?? "",
        proprietario_email: c.proprietario_email ?? "",
        valor_pretendido: c.valor_pretendido ? String(c.valor_pretendido) : "",
        condicoes: c.condicoes ?? "",
        observacoes: c.observacoes ?? "",
        status: c.status,
        corretor_id: c.corretor_id ?? "",
        data_vistoria: c.data_vistoria ?? "",
      });

      setLoading(false);
    });

    listarFotosCaptacao(id).then(setFotosExistentes);
  }, [id]);

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function adicionarFotos(arquivos: FileList | null) {
    if (!arquivos) return;
    const novas = Array.from(arquivos).map((file) => ({
      key: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setFotosNovas((prev) => [...prev, ...novas]);
  }

  async function removerFotoExistente(fotoId: string) {
    await excluirFotoCaptacao(fotoId);
    setFotosExistentes((prev) => prev.filter((f) => f.id !== fotoId));
  }

  function removerFotoNova(key: string) {
    setFotosNovas((prev) => prev.filter((f) => f.key !== key));
  }

  async function salvar() {
    setSalvando(true);

    try {
      await atualizarCaptacao(id, {
        titulo: form.titulo,
        tipo: form.tipo,
        endereco: form.endereco || null,
        bairro: form.bairro || null,
        cidade: form.cidade || null,
        estado: form.estado || null,
        cep: form.cep || null,
        quartos: form.quartos ? Number(form.quartos) : null,
        suites: form.suites ? Number(form.suites) : null,
        banheiros: form.banheiros ? Number(form.banheiros) : null,
        vagas: form.vagas ? Number(form.vagas) : null,
        area_privativa: form.area_privativa ? Number(form.area_privativa) : null,
        proprietario_nome: form.proprietario_nome,
        proprietario_telefone: form.proprietario_telefone || null,
        proprietario_email: form.proprietario_email || null,
        valor_pretendido: form.valor_pretendido ? Number(form.valor_pretendido) : null,
        condicoes: form.condicoes || null,
        observacoes: form.observacoes || null,
        status: form.status,
        corretor_id: form.corretor_id || null,
        data_vistoria: form.data_vistoria || null,
      });

      for (let i = 0; i < fotosNovas.length; i++) {
        await uploadFotoCaptacao(id, fotosNovas[i].file, fotosExistentes.length + i);
      }

      toast.success("Captação atualizada!");
      router.push("/captacoes");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function converter() {
    if (!confirm("Converter essa captação em anúncio de imóvel agora?")) return;

    setConvertendo(true);

    try {
      const novoImovelId = await converterEmAnuncio(id);
      toast.success("Anúncio criado com sucesso!");
      router.push(`/imoveis/${novoImovelId}/editar`);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível converter em anúncio.");
    } finally {
      setConvertendo(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <p className="font-sans text-slate-400">Carregando...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>

      <div className="mx-auto max-w-3xl pb-20">

        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-navy">
            Editar Captação
          </h1>

          {imovelId && (
            <Link
              href={`/imoveis/${imovelId}`}
              className="flex items-center gap-2 font-sans text-sm font-semibold text-gold hover:underline"
            >
              <Home size={15} />
              Ver anúncio gerado
            </Link>
          )}
        </div>

        <p className="mb-8 font-sans text-slate-500">
          Ficha de vistoria pra avaliar um imóvel antes de virar anúncio.
        </p>

        {/* Dados do imóvel */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Dados do Imóvel
          </h2>

          <div className="space-y-4">

            <div>
              <label className={labelClass}>Título / Identificação</label>
              <input
                value={form.titulo}
                onChange={(e) => atualizar("titulo", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => atualizar("tipo", e.target.value)}
                  className={inputClass}
                >
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  <option>Comercial</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Endereço</label>
                <input
                  value={form.endereco}
                  onChange={(e) => atualizar("endereco", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>Bairro</label>
                <input
                  value={form.bairro}
                  onChange={(e) => atualizar("bairro", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Cidade</label>
                <input
                  value={form.cidade}
                  onChange={(e) => atualizar("cidade", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>UF</label>
                <input
                  value={form.estado}
                  onChange={(e) => atualizar("estado", e.target.value)}
                  maxLength={2}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>CEP</label>
                <input
                  value={form.cep}
                  onChange={(e) => atualizar("cep", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              <div>
                <label className={labelClass}>Quartos</label>
                <input
                  type="number"
                  value={form.quartos}
                  onChange={(e) => atualizar("quartos", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Suítes</label>
                <input
                  type="number"
                  value={form.suites}
                  onChange={(e) => atualizar("suites", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Banheiros</label>
                <input
                  type="number"
                  value={form.banheiros}
                  onChange={(e) => atualizar("banheiros", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Vagas</label>
                <input
                  type="number"
                  value={form.vagas}
                  onChange={(e) => atualizar("vagas", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Área (m²)</label>
                <input
                  type="number"
                  value={form.area_privativa}
                  onChange={(e) => atualizar("area_privativa", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Proprietário */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Proprietário
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                value={form.proprietario_nome}
                onChange={(e) => atualizar("proprietario_nome", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Telefone</label>
              <input
                value={form.proprietario_telefone}
                onChange={(e) =>
                  atualizar("proprietario_telefone", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={form.proprietario_email}
                onChange={(e) => atualizar("proprietario_email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

        </div>

        {/* Avaliação */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Avaliação
          </h2>

          <div className="space-y-4">

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Valor Pretendido</label>
                <CampoMoeda
                  value={form.valor_pretendido}
                  onChange={(v) => atualizar("valor_pretendido", v)}
                />
              </div>
              <div>
                <label className={labelClass}>Data da Vistoria</label>
                <input
                  type="date"
                  value={form.data_vistoria}
                  onChange={(e) => atualizar("data_vistoria", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Condições do Imóvel</label>
              <textarea
                value={form.condicoes}
                onChange={(e) => atualizar("condicoes", e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Observações</label>
              <textarea
                value={form.observacoes}
                onChange={(e) => atualizar("observacoes", e.target.value)}
                rows={2}
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => atualizar("status", e.target.value)}
                  className={inputClass}
                >
                  {STATUS_CAPTACAO.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Corretor Responsável</label>
                <select
                  value={form.corretor_id}
                  onChange={(e) => atualizar("corretor_id", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecione</option>
                  {corretores.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Fotos */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Fotos da Vistoria
          </h2>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 font-sans text-sm text-slate-500 hover:border-gold hover:text-gold">
            <Upload size={18} />
            Clique para escolher mais fotos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => adicionarFotos(e.target.files)}
            />
          </label>

          {(fotosExistentes.length > 0 || fotosNovas.length > 0) && (
            <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-4">

              {fotosExistentes.map((foto) => (
                <div key={foto.id} className="relative">
                  <img
                    src={foto.url}
                    alt=""
                    className="h-24 w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={() => removerFotoExistente(foto.id)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                  >
                    <X size={12} className="text-slate-600" />
                  </button>
                </div>
              ))}

              {fotosNovas.map((foto) => (
                <div key={foto.key} className="relative">
                  <img
                    src={foto.url}
                    alt=""
                    className="h-24 w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={() => removerFotoNova(foto.key)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                  >
                    <X size={12} className="text-slate-600" />
                  </button>
                </div>
              ))}

            </div>
          )}

        </div>

        <button
          onClick={salvar}
          disabled={salvando}
          className="mt-8 w-full rounded-2xl bg-navy py-5 font-sans text-lg font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>

        {!imovelId && (
          <button
            onClick={converter}
            disabled={convertendo}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gold py-5 font-sans text-lg font-semibold text-gold transition hover:bg-gold/5 disabled:opacity-60"
          >
            <ArrowRightCircle size={20} />
            {convertendo ? "Convertendo..." : "Converter em Anúncio"}
          </button>
        )}

      </div>

    </AppShell>
  );
}
