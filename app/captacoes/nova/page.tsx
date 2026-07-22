"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CampoMoeda from "@/components/ui/form/CampoMoeda";
import {
  criarCaptacao,
  uploadFotoCaptacao,
  STATUS_CAPTACAO,
} from "@/features/captacoes/services/captacoes.service";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import DetalhesImovelSelector from "@/features/imoveis/components/DetalhesImovelSelector";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-navy outline-none focus:border-gold";
const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function NovaCaptacaoPage() {
  const router = useRouter();

  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [salvando, setSalvando] = useState(false);

  const [fotos, setFotos] = useState<{ key: string; file: File; url: string }[]>([]);
  const [detalhes, setDetalhes] = useState<string[]>([]);

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
    data_vistoria: new Date().toISOString().split("T")[0],
    motivo_venda: "",
    documentacao_status: "Em dia",
    documentacao_observacao: "",
    aceita_permuta: false,
    valor_minimo_aceito: "",
    tem_inquilino: false,
    inquilino_ate: "",
    exclusividade: false,
    exclusividade_ate: "",
    origem_captacao: "",
  });

  useEffect(() => {
    listarCorretoresAtivos().then(setCorretores);
  }, []);

  function atualizar(campo: string, valor: string | boolean) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function adicionarFotos(arquivos: FileList | null) {
    if (!arquivos) return;

    const novas = Array.from(arquivos).map((file) => ({
      key: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setFotos((prev) => [...prev, ...novas]);
  }

  function removerFoto(key: string) {
    setFotos((prev) => prev.filter((f) => f.key !== key));
  }

  async function salvar() {
    if (!form.titulo || !form.proprietario_nome) {
      toast.error("Preenche pelo menos o título e o nome do proprietário.");
      return;
    }

    setSalvando(true);

    try {
      const captacao = await criarCaptacao({
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
        detalhes,
        motivo_venda: form.motivo_venda || null,
        documentacao_status: form.documentacao_status || null,
        documentacao_observacao: form.documentacao_observacao || null,
        aceita_permuta: form.aceita_permuta,
        valor_minimo_aceito: form.valor_minimo_aceito
          ? Number(form.valor_minimo_aceito)
          : null,
        tem_inquilino: form.tem_inquilino,
        inquilino_ate: form.tem_inquilino ? form.inquilino_ate || null : null,
        exclusividade: form.exclusividade,
        exclusividade_ate: form.exclusividade
          ? form.exclusividade_ate || null
          : null,
        origem_captacao: form.origem_captacao || null,
      });

      for (let i = 0; i < fotos.length; i++) {
        await uploadFotoCaptacao(captacao.id, fotos[i].file, i);
      }

      toast.success("Captação registrada!");
      router.push("/captacoes");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar a captação.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AppShell>

      <div className="mx-auto max-w-3xl pb-20">

        <h1 className="mb-2 font-display text-3xl font-bold text-navy">
          Nova Captação
        </h1>
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
                placeholder="Ex: Apartamento na Praia dos Carneiros"
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

        {/* Condições e valor */}

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
                placeholder="Estado de conservação, reformas necessárias, pontos fortes..."
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
                  {STATUS_CAPTACAO.filter((s) => s !== "Convertido em anúncio").map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
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

        {/* Lazer e Estrutura */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Lazer e Estrutura
          </h2>

          <DetalhesImovelSelector
            selecionados={detalhes}
            onChange={setDetalhes}
          />

        </div>

        {/* Informações Adicionais */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Informações Adicionais
          </h2>

          <div className="space-y-4">

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Motivo da Venda</label>
                <input
                  value={form.motivo_venda}
                  onChange={(e) => atualizar("motivo_venda", e.target.value)}
                  placeholder="Ex: mudança de cidade, urgência financeira..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Como conheceu a Dunna</label>
                <input
                  value={form.origem_captacao}
                  onChange={(e) =>
                    atualizar("origem_captacao", e.target.value)
                  }
                  placeholder="Ex: indicação, site, Instagram..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Documentação</label>
                <select
                  value={form.documentacao_status}
                  onChange={(e) =>
                    atualizar("documentacao_status", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Em dia</option>
                  <option>Pendências</option>
                  <option>Não sei informar</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Observações sobre a documentação
                </label>
                <input
                  value={form.documentacao_observacao}
                  onChange={(e) =>
                    atualizar("documentacao_observacao", e.target.value)
                  }
                  placeholder="Ex: falta averbação da reforma..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.aceita_permuta}
                  onChange={(e) =>
                    atualizar("aceita_permuta", e.target.checked)
                  }
                  className="h-5 w-5 accent-gold"
                />
                <span className="font-sans text-navy">Aceita permuta</span>
              </label>

              <div>
                <label className={labelClass}>Valor Mínimo Aceito</label>
                <CampoMoeda
                  value={form.valor_minimo_aceito}
                  onChange={(v) => atualizar("valor_minimo_aceito", v)}
                />
              </div>

            </div>

            <div>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.tem_inquilino}
                  onChange={(e) =>
                    atualizar("tem_inquilino", e.target.checked)
                  }
                  className="h-5 w-5 accent-gold"
                />
                <span className="font-sans text-navy">
                  Tem inquilino morando no imóvel
                </span>
              </label>

              {form.tem_inquilino && (
                <div className="mt-3">
                  <label className={labelClass}>
                    Contrato de aluguel válido até
                  </label>
                  <input
                    type="date"
                    value={form.inquilino_ate}
                    onChange={(e) =>
                      atualizar("inquilino_ate", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={form.exclusividade}
                  onChange={(e) =>
                    atualizar("exclusividade", e.target.checked)
                  }
                  className="h-5 w-5 accent-gold"
                />
                <span className="font-sans text-navy">
                  Venda com exclusividade pra Dunna
                </span>
              </label>

              {form.exclusividade && (
                <div className="mt-3">
                  <label className={labelClass}>Exclusividade até</label>
                  <input
                    type="date"
                    value={form.exclusividade_ate}
                    onChange={(e) =>
                      atualizar("exclusividade_ate", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              )}
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
            Clique para escolher as fotos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => adicionarFotos(e.target.files)}
            />
          </label>

          {fotos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-4">
              {fotos.map((foto) => (
                <div key={foto.key} className="relative">
                  <img
                    src={foto.url}
                    alt=""
                    className="h-24 w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={() => removerFoto(foto.key)}
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
          {salvando ? "Salvando..." : "Salvar Captação"}
        </button>

      </div>

    </AppShell>
  );
}
