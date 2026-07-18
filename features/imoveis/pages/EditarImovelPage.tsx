"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import {
  atualizarFotoImovel,
  atualizarImovel,
  buscarImovel,
  excluirFotoImovel,
  listarFotosImovel,
  salvarFotoImovel,
  uploadFotoImovel,
} from "../services/imoveis.service";
import { listarCorretoresAtivos } from "@/features/unidades/services/unidade.service";
import { Corretor } from "@/features/unidades/types/unidade";
import GerenciadorFotos, { ItemFoto } from "../components/GerenciadorFotos";
import DetalhesImovelSelector from "../components/DetalhesImovelSelector";
import SecoesNav from "@/components/ui/form/SecoesNav";

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

export default function EditarImovelPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState(camposIniciais);
  const [detalhes, setDetalhes] = useState<string[]>([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [fotos, setFotos] = useState<ItemFoto[]>([]);
  const [capaKey, setCapaKey] = useState<string | null>(null);
  const [fotosRemovidas, setFotosRemovidas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarCorretoresAtivos().then(setCorretores).catch(() => {});

    listarFotosImovel(id).then((fotosSalvas) => {
      const itens: ItemFoto[] = fotosSalvas.map((f) => ({
        key: f.id,
        url: f.url,
        existingId: f.id,
      }));

      setFotos(itens);

      const capa = fotosSalvas.find((f) => f.capa);
      setCapaKey(capa?.id ?? itens[0]?.key ?? null);
    });

    buscarImovel(id)
      .then((imovel) => {
        setForm({
          titulo: imovel.titulo ?? "",
          tipo: imovel.tipo ?? "",
          status: imovel.status ?? "",
          codigo: imovel.codigo ?? "",
          descricao: imovel.descricao ?? "",
          cidade: imovel.cidade ?? "",
          bairro: imovel.bairro ?? "",
          endereco: imovel.endereco ?? "",
          cep: imovel.cep ?? "",
          quartos: imovel.quartos?.toString() ?? "",
          suites: imovel.suites?.toString() ?? "",
          banheiros: imovel.banheiros?.toString() ?? "",
          vagas: imovel.vagas?.toString() ?? "",
          area_privativa: imovel.area_privativa?.toString() ?? "",
          area_total: imovel.area_total?.toString() ?? "",
          preco: imovel.preco?.toString() ?? "",
          condominio: imovel.condominio?.toString() ?? "",
          iptu: imovel.iptu?.toString() ?? "",
          comissao: imovel.comissao?.toString() ?? "",
          corretor_id: imovel.corretor_id ?? "",
          selo: imovel.selo ?? "",
          publicado: imovel.publicado ?? false,
        });

        setDetalhes(imovel.detalhes ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
    const item = fotos.find((f) => f.key === key);

    if (item?.existingId) {
      setFotosRemovidas((prev) => [...prev, item.existingId as string]);
    }

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
      await atualizarImovel(id, {
        titulo: form.titulo,
        tipo: form.tipo || null,
        status: form.status || null,
        codigo: form.codigo || null,
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
        detalhes,
      });

      for (const fotoId of fotosRemovidas) {
        await excluirFotoImovel(fotoId);
      }

      for (let i = 0; i < fotos.length; i++) {
        const item = fotos[i];
        const ehCapa = item.key === capaKey;

        if (item.existingId) {
          await atualizarFotoImovel(item.existingId, {
            ordem: i,
            capa: ehCapa,
          });
        } else if (item.file) {
          const url = await uploadFotoImovel(id, item.file);
          await salvarFotoImovel(id, url, i, ehCapa);
        }
      }

      toast.success("Imóvel atualizado com sucesso!");
      router.push(`/imoveis/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "rounded-xl border border-slate-200 bg-slate-50 p-4 font-sans text-navy outline-none focus:border-gold";

  if (loading) {
    return <p className="font-sans text-slate-400">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-3xl font-bold text-navy">
        Editar Imóvel
      </h1>

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
              placeholder="Tipo"
              className={inputClass}
            />

            <input
              value={form.status}
              onChange={(e) => atualizar("status", e.target.value)}
              placeholder="Status"
              className={inputClass}
            />

            <input
              value={form.codigo}
              onChange={(e) => atualizar("codigo", e.target.value)}
              placeholder="Código"
              className={inputClass}
            />

            <input
              value={form.selo}
              onChange={(e) => atualizar("selo", e.target.value)}
              placeholder="Selo"
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

          <input
            value={form.preco}
            onChange={(e) => atualizar("preco", e.target.value)}
            placeholder="Preço (R$)"
            type="number"
            className={inputClass}
          />

          <input
            value={form.condominio}
            onChange={(e) => atualizar("condominio", e.target.value)}
            placeholder="Condomínio (R$)"
            type="number"
            className={inputClass}
          />

          <input
            value={form.iptu}
            onChange={(e) => atualizar("iptu", e.target.value)}
            placeholder="IPTU (R$)"
            type="number"
            className={inputClass}
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
          onClick={() => router.push(`/imoveis/${id}`)}
          className="rounded-xl border border-slate-200 px-6 py-3 font-sans text-slate-600 transition hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          onClick={handleSalvar}
          disabled={salvando}
          className="rounded-xl bg-gold px-8 py-3 font-sans font-semibold text-white transition hover:bg-gold-dark disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>

      </div>

    </div>
  );
}
