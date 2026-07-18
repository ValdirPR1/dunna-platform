"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import {
  criarImovel,
  salvarFotoImovel,
  uploadFotoImovel,
} from "../services/imoveis.service";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import GerenciadorFotos, { ItemFoto } from "../components/GerenciadorFotos";
import DetalhesImovelSelector from "../components/DetalhesImovelSelector";
import SecoesNav from "@/components/ui/form/SecoesNav";
import CampoMoeda from "@/components/ui/form/CampoMoeda";

const SECOES_IMOVEL = [
  { id: "sec-dados", label: "Dados principais" },
  { id: "sec-localizacao", label: "Localização" },
  { id: "sec-caracteristicas", label: "Características" },
  { id: "sec-detalhes", label: "Detalhes e Diferenciais" },
  { id: "sec-valores", label: "Valores" },
  { id: "sec-responsavel", label: "Responsável e publicação" },
  { id: "sec-fotos", label: "Fotos" },
];

const camposIniciais = {
  titulo: "",
  tipo: "",
  status: "",
  codigo: "",
  descricao: "",
  cidade: "",
  bairro: "",
  endereco: "",
  cep: "",
  quartos: "",
  suites: "",
  banheiros: "",
  vagas: "",
  area_privativa: "",
  area_total: "",
  preco: "",
  condominio: "",
  iptu: "",
  comissao: "",
  corretor_id: "",
  selo: "",
  publicado: false,
};

export default function NovoImovelPage() {
  const router = useRouter();
  const [form, setForm] = useState(camposIniciais);
  const [detalhes, setDetalhes] = useState<string[]>([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [fotos, setFotos] = useState<ItemFoto[]>([]);
  const [capaKey, setCapaKey] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarCorretoresAtivos().then(setCorretores).catch(() => {});
  }, []);

  function atualizar(campo: string, valor: string | boolean) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function adicionarFotos(arquivos: FileList | null) {
    if (!arquivos) return;

    const novos: ItemFoto[] = Array.from(arquivos).map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setFotos((prev) => {
      const atualizado = [...prev, ...novos];
      if (!capaKey && atualizado.length > 0) {
        setCapaKey(atualizado[0].key);
      }
      return atualizado;
    });
  }

  function removerFoto(key: string) {
    setFotos((prev) => {
      const atualizado = prev.filter((item) => item.key !== key);
      if (capaKey === key) {
        setCapaKey(atualizado[0]?.key ?? null);
      }
      return atualizado;
    });
  }

  const enderecoCompleto = [form.endereco, form.bairro, form.cidade]
    .filter(Boolean)
    .join(", ");

  async function handleSalvar() {
    if (!form.titulo) {
      toast.error("Preencha o título do imóvel.");
      return;
    }

    setSalvando(true);

    try {
      const payload = {
        titulo: form.titulo,
        tipo: form.tipo || null,
        status: form.status || null,
        descricao: form.descricao || null,
        cidade: form.cidade || null,
        bairro: form.bairro || null,
        endereco: form.endereco || null,
        cep: form.cep || null,
        quartos: form.quartos ? Number(form.quartos) : null,
        suites: form.suites ? Number(form.suites) : null,
        banheiros: form.banheiros ? Number(form.banheiros) : null,
        vagas: form.vagas ? Number(form.vagas) : null,
        area_privativa: form.area_privativa ? Number(form.area_privativa) : null,
        area_total: form.area_total ? Number(form.area_total) : null,
        preco: form.preco ? Number(form.preco) : null,
        condominio: form.condominio ? Number(form.condominio) : null,
        iptu: form.iptu ? Number(form.iptu) : null,
        comissao: form.comissao ? Number(form.comissao) : null,
        corretor_id: form.corretor_id || null,
        selo: form.selo || null,
        publicado: form.publicado,
        ativo: true,
        detalhes,
      };

      const imovel = await criarImovel(payload);

      for (let i = 0; i < fotos.length; i++) {
        const item = fotos[i];
        if (!item.file) continue;
        const url = await uploadFotoImovel(imovel.id, item.file);
        await salvarFotoImovel(imovel.id, url, i, item.key === capaKey);
      }

      toast.success("Imóvel cadastrado com sucesso!");
      router.push("/imoveis");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o imóvel.");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-3xl font-bold text-navy">
        Novo Imóvel
      </h1>

      <p className="mt-2 font-sans text-slate-500">
        Cadastro completo de imóvel avulso (revenda ou captação).
      </p>

      <div className="mt-6">
        <SecoesNav secoes={SECOES_IMOVEL} />
      </div>

      {/* Dados principais */}

      <div id="sec-dados" className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Dados principais
        </h2>

        <div className="mt-6 grid gap-5">

          <input
            value={form.titulo}
            onChange={(e) => atualizar("titulo", e.target.value)}
            placeholder="Título do anúncio *"
            className={inputClass}
          />

          <textarea
            value={form.descricao}
            onChange={(e) => atualizar("descricao", e.target.value)}
            placeholder="Descrição"
            rows={5}
            className={inputClass}
          />

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

            <input
              value={form.tipo}
              onChange={(e) => atualizar("tipo", e.target.value)}
              placeholder="Tipo (casa, apto...)"
              className={inputClass}
            />

            <input
              value={form.status}
              onChange={(e) => atualizar("status", e.target.value)}
              placeholder="Status"
              className={inputClass}
            />

            <div className="flex items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 font-sans text-sm text-slate-400">
              Código gerado automaticamente ao salvar
            </div>

            <input
              value={form.selo}
              onChange={(e) => atualizar("selo", e.target.value)}
              placeholder="Selo (ex: Exclusivo)"
              className={inputClass}
            />

          </div>

        </div>

      </div>

      {/* Localização */}

      <div id="sec-localizacao" className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Localização
        </h2>

        <div className="mt-6 grid gap-5">

          <input
            value={form.endereco}
            onChange={(e) => atualizar("endereco", e.target.value)}
            placeholder="Endereço"
            className={inputClass}
          />

          <div className="grid grid-cols-3 gap-5">

            <input
              value={form.bairro}
              onChange={(e) => atualizar("bairro", e.target.value)}
              placeholder="Bairro"
              className={inputClass}
            />

            <input
              value={form.cidade}
              onChange={(e) => atualizar("cidade", e.target.value)}
              placeholder="Cidade"
              className={inputClass}
            />

            <input
              value={form.cep}
              onChange={(e) => atualizar("cep", e.target.value)}
              placeholder="CEP"
              className={inputClass}
            />

          </div>

        </div>

        {enderecoCompleto && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">

            <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 font-sans text-sm text-slate-500">
              <MapPin size={16} className="text-gold" />
              Pré-visualização no mapa
            </div>

            <iframe
              title="Mapa do imóvel"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                enderecoCompleto
              )}&output=embed`}
            />

          </div>
        )}

      </div>

      {/* Características */}

      <div id="sec-caracteristicas" className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Características
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">

          <input
            value={form.quartos}
            onChange={(e) => atualizar("quartos", e.target.value)}
            placeholder="Quartos"
            type="number"
            className={inputClass}
          />

          <input
            value={form.suites}
            onChange={(e) => atualizar("suites", e.target.value)}
            placeholder="Suítes"
            type="number"
            className={inputClass}
          />

          <input
            value={form.banheiros}
            onChange={(e) => atualizar("banheiros", e.target.value)}
            placeholder="Banheiros"
            type="number"
            className={inputClass}
          />

          <input
            value={form.vagas}
            onChange={(e) => atualizar("vagas", e.target.value)}
            placeholder="Vagas"
            type="number"
            className={inputClass}
          />

          <input
            value={form.area_privativa}
            onChange={(e) => atualizar("area_privativa", e.target.value)}
            placeholder="Área privativa (m²)"
            type="number"
            className={inputClass}
          />

          <input
            value={form.area_total}
            onChange={(e) => atualizar("area_total", e.target.value)}
            placeholder="Área total (m²)"
            type="number"
            className={inputClass}
          />

        </div>

      </div>

      {/* Detalhes e Diferenciais */}

      <div id="sec-detalhes" className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Detalhes e Diferenciais
        </h2>

        <p className="mt-1 mb-6 font-sans text-sm text-slate-500">
          Marque tudo que se aplica a esse imóvel. Aparece na página
          pública, igual fizemos nos empreendimentos.
        </p>

        <DetalhesImovelSelector
          selecionados={detalhes}
          onChange={setDetalhes}
        />

      </div>

      {/* Valores */}

      <div id="sec-valores" className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Valores
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">

          <CampoMoeda
            value={form.preco}
            onChange={(valor) => atualizar("preco", valor)}
            placeholder="Preço"
          />

          <CampoMoeda
            value={form.condominio}
            onChange={(valor) => atualizar("condominio", valor)}
            placeholder="Condomínio"
          />

          <CampoMoeda
            value={form.iptu}
            onChange={(valor) => atualizar("iptu", valor)}
            placeholder="IPTU"
          />

          <input
            value={form.comissao}
            onChange={(e) => atualizar("comissao", e.target.value)}
            placeholder="Comissão (%)"
            type="number"
            className={inputClass}
          />

        </div>

      </div>

      {/* Corretor e publicação */}

      <div id="sec-responsavel" className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Responsável e publicação
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <select
            value={form.corretor_id}
            onChange={(e) => atualizar("corretor_id", e.target.value)}
            className={inputClass}
          >
            <option value="">Sem corretor definido</option>
            {corretores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy">
            <input
              type="checkbox"
              checked={form.publicado}
              onChange={(e) => atualizar("publicado", e.target.checked)}
              className="h-5 w-5 accent-gold"
            />
            Publicar no site
          </label>

        </div>

      </div>

      {/* Fotos */}

      <div id="sec-fotos" className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="font-display text-xl font-bold text-navy">
          Fotos
        </h2>

        <p className="mt-1 mb-6 font-sans text-sm text-slate-500">
          Clique na estrela pra escolher a foto de capa, e use as
          setas pra reordenar.
        </p>

        <GerenciadorFotos
          itens={fotos}
          capaKey={capaKey}
          onAdicionar={adicionarFotos}
          onSetCapa={setCapaKey}
          onReordenar={setFotos}
          onRemover={removerFoto}
        />

      </div>

      {/* Ações */}

      <div className="mt-8 flex justify-end gap-3 pb-16">

        <button
          onClick={() => router.push("/imoveis")}
          className="rounded-xl border border-slate-200 px-6 py-3 font-sans text-slate-600 transition hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          onClick={handleSalvar}
          disabled={salvando}
          className="rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar Imóvel"}
        </button>

      </div>

    </div>
  );
}
