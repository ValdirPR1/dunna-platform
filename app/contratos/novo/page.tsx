"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileDown, Plus, Save, Trash2 } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import CampoMoeda from "@/components/ui/form/CampoMoeda";
import CamposPessoaContrato from "@/features/contratos/components/CamposPessoaContrato";
import {
  CONTRATO_VAZIO,
  ContratoFormData,
  PESSOA_VAZIA,
  PessoaContrato,
} from "@/features/contratos/types/contrato";
import { gerarContratoPDF } from "@/features/contratos/pdf/gerarContratoPDF";
import {
  DocumentoGeradoResumo,
  carregarDocumentoGerado,
  excluirDocumentoGerado,
  listarDocumentosGerados,
  salvarDocumentoGerado,
} from "@/features/contratos/services/documentosGerados.service";
import { useAuth } from "@/features/core/auth/useAuth";

// Título mostrado no seletor de rascunhos salvos — pra identificar de
// relance qual contrato é qual sem precisar abrir todos.
function tituloRascunho(form: ContratoFormData) {
  const comprador = form.compradores[0]?.nome?.trim() || "Comprador(a)";
  const imovel =
    form.imovelEndereco?.trim() ||
    form.imovelEdificio?.trim() ||
    (form.imovelNumero?.trim() ? `${form.imovelTipo} ${form.imovelNumero}` : "") ||
    "imóvel";
  return `${comprador} — ${imovel}`;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 font-sans text-navy outline-none focus:border-gold";
const labelClass =
  "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function NovoContratoPage() {
  const { usuario } = useAuth();
  const [gerando, setGerando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [rascunhoId, setRascunhoId] = useState<string | null>(null);
  const [rascunhos, setRascunhos] = useState<DocumentoGeradoResumo[]>([]);

  const [form, setForm] = useState<ContratoFormData>({ ...CONTRATO_VAZIO });

  async function carregarListaRascunhos() {
    setRascunhos(await listarDocumentosGerados("contrato_compra_venda"));
  }

  useEffect(() => {
    carregarListaRascunhos();
  }, []);

  function novoContrato() {
    setForm({ ...CONTRATO_VAZIO });
    setRascunhoId(null);
  }

  async function handleSelecionarRascunho(id: string) {
    if (!id) {
      novoContrato();
      return;
    }
    const dados = await carregarDocumentoGerado<ContratoFormData>(id);
    if (!dados) {
      toast.error("Não foi possível carregar esse rascunho.");
      return;
    }
    setForm(dados);
    setRascunhoId(id);
    toast.success("Rascunho carregado.");
  }

  async function salvarRascunho() {
    if (!usuario) return;
    setSalvando(true);
    try {
      const id = await salvarDocumentoGerado(
        rascunhoId,
        "contrato_compra_venda",
        tituloRascunho(form),
        form,
        usuario.id
      );
      setRascunhoId(id);
      await carregarListaRascunhos();
      toast.success("Contrato salvo.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o contrato.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluirRascunho() {
    if (!rascunhoId) return;
    if (
      !window.confirm(
        "Excluir este contrato salvo? Depois que todos assinarem o PDF, dá pra tirar da base assim — a exclusão não pode ser desfeita."
      )
    )
      return;

    try {
      await excluirDocumentoGerado(rascunhoId);
      toast.success("Contrato excluído.");
      novoContrato();
      await carregarListaRascunhos();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível excluir.");
    }
  }

  function atualizar<K extends keyof ContratoFormData>(
    campo: K,
    valor: ContratoFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function atualizarPessoa(
    grupo: "vendedores" | "compradores",
    index: number,
    campo: keyof PessoaContrato,
    valor: string
  ) {
    setForm((prev) => {
      const lista = [...prev[grupo]];
      lista[index] = { ...lista[index], [campo]: valor };
      return { ...prev, [grupo]: lista };
    });
  }

  function adicionarPessoa(grupo: "vendedores" | "compradores") {
    setForm((prev) => ({
      ...prev,
      [grupo]: [...prev[grupo], { ...PESSOA_VAZIA }],
    }));
  }

  function removerPessoa(grupo: "vendedores" | "compradores", index: number) {
    setForm((prev) => ({
      ...prev,
      [grupo]: prev[grupo].filter((_, i) => i !== index),
    }));
  }

  async function gerarPDF() {
    setGerando(true);
    try {
      await gerarContratoPDF(form);
    } finally {
      setGerando(false);
    }
  }

  return (
    <AppShell>

      <div className="mx-auto max-w-3xl pb-20">

        <h1 className="mb-2 font-display text-3xl font-bold text-navy">
          Novo Contrato de Compra e Venda
        </h1>
        <p className="mb-6 font-sans text-slate-500">
          Preenche os dados abaixo e gera o contrato completo em PDF.
        </p>

        {/* Rascunhos salvos */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <label className={labelClass + " mb-0"}>Rascunho</label>
            <select
              value={rascunhoId ?? ""}
              onChange={(e) => handleSelecionarRascunho(e.target.value)}
              className="rounded-lg border border-slate-200 p-2 font-sans text-sm text-navy"
            >
              <option value="">Contrato novo em branco</option>
              {rascunhos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.titulo}
                </option>
              ))}
            </select>
          </div>

          {rascunhoId && (
            <button
              onClick={handleExcluirRascunho}
              className="flex items-center gap-1.5 font-sans text-sm font-semibold text-red-500 hover:text-red-600"
            >
              <Trash2 size={14} />
              Excluir este contrato salvo
            </button>
          )}
        </div>

        {/* Vendedores */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Vendedor(es)
          </h2>

          {form.vendedores.map((vendedor, i) => (
            <div key={i} className={i > 0 ? "mt-6 border-t border-slate-100 pt-6" : ""}>

              {i > 0 && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-sans text-sm font-semibold text-slate-500">
                    2º Vendedor(a)
                  </span>
                  <button
                    onClick={() => removerPessoa("vendedores", i)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <CamposPessoaContrato
                dados={vendedor}
                onChange={(campo, valor) =>
                  atualizarPessoa("vendedores", i, campo, valor)
                }
              />
            </div>
          ))}

          {form.vendedores.length < 2 && (
            <button
              onClick={() => adicionarPessoa("vendedores")}
              className="mt-4 flex items-center gap-2 font-sans text-sm font-semibold text-gold"
            >
              <Plus size={15} />
              Adicionar 2º Vendedor(a) (cônjuge, por exemplo)
            </button>
          )}

        </div>

        {/* Compradores */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Comprador(es)
          </h2>

          {form.compradores.map((comprador, i) => (
            <div key={i} className={i > 0 ? "mt-6 border-t border-slate-100 pt-6" : ""}>

              {i > 0 && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-sans text-sm font-semibold text-slate-500">
                    2º Comprador(a)
                  </span>
                  <button
                    onClick={() => removerPessoa("compradores", i)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <CamposPessoaContrato
                dados={comprador}
                onChange={(campo, valor) =>
                  atualizarPessoa("compradores", i, campo, valor)
                }
              />
            </div>
          ))}

          {form.compradores.length < 2 && (
            <button
              onClick={() => adicionarPessoa("compradores")}
              className="mt-4 flex items-center gap-2 font-sans text-sm font-semibold text-gold"
            >
              <Plus size={15} />
              Adicionar 2º Comprador(a)
            </button>
          )}

        </div>

        {/* Imóvel */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Imóvel
          </h2>

          <div className="space-y-4">

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>Tipo</label>
                <select
                  value={form.imovelTipo}
                  onChange={(e) => atualizar("imovelTipo", e.target.value)}
                  className={inputClass}
                >
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  <option>Sala Comercial</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Número / Identificação</label>
                <input
                  value={form.imovelNumero}
                  onChange={(e) => atualizar("imovelNumero", e.target.value)}
                  placeholder='Ex: 220, tipo "E"'
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Pavimento</label>
                <input
                  value={form.imovelPavimento}
                  onChange={(e) => atualizar("imovelPavimento", e.target.value)}
                  placeholder="Ex: segundo pavimento"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Nome do Edifício/Empreendimento</label>
              <input
                value={form.imovelEdificio}
                onChange={(e) => atualizar("imovelEdificio", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Endereço completo do imóvel</label>
              <input
                value={form.imovelEndereco}
                onChange={(e) => atualizar("imovelEndereco", e.target.value)}
                placeholder="Rua, número, bairro, cidade - UF, CEP"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Matrícula nº</label>
                <input
                  value={form.imovelMatricula}
                  onChange={(e) => atualizar("imovelMatricula", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Cartório de Registro (cidade-UF)</label>
                <input
                  value={form.imovelCartorio}
                  onChange={(e) => atualizar("imovelCartorio", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>Sequencial nº</label>
                <input
                  value={form.imovelSequencial}
                  onChange={(e) => atualizar("imovelSequencial", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Inscrição Imobiliária</label>
                <input
                  value={form.imovelInscricaoImobiliaria}
                  onChange={(e) =>
                    atualizar("imovelInscricaoImobiliaria", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Prefeitura</label>
                <input
                  value={form.imovelPrefeitura}
                  onChange={(e) => atualizar("imovelPrefeitura", e.target.value)}
                  placeholder="Ex: Prefeitura Municipal de Ipojuca - PE"
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={form.temAlienacao}
                onChange={(e) => atualizar("temAlienacao", e.target.checked)}
                className="h-5 w-5 accent-gold"
              />
              <span className="font-sans text-navy">
                Imóvel alienado / financiado (adiciona cláusula sobre o banco)
              </span>
            </label>

            {form.temAlienacao && (
              <input
                value={form.bancoAlienacao}
                onChange={(e) => atualizar("bancoAlienacao", e.target.value)}
                placeholder="Nome do banco financiador"
                className={inputClass}
              />
            )}

          </div>

        </div>

        {/* Preço e pagamento */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Preço e Pagamento
          </h2>

          <div className="space-y-4">

            <div>
              <label className={labelClass}>Valor Total da Venda</label>
              <CampoMoeda
                value={form.valorTotal}
                onChange={(v) => atualizar("valorTotal", v)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Valor do Sinal</label>
                <CampoMoeda
                  value={form.valorSinal}
                  onChange={(v) => atualizar("valorSinal", v)}
                />
              </div>
              <div>
                <label className={labelClass}>Como é pago o sinal</label>
                <input
                  value={form.formaSinal}
                  onChange={(e) => atualizar("formaSinal", e.target.value)}
                  placeholder="Ex: na assinatura, via boleto de quitação..."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Valor do Saldo</label>
              <CampoMoeda
                value={form.valorSaldo}
                onChange={(v) => atualizar("valorSaldo", v)}
              />
            </div>

            <div>
              <label className={labelClass}>Forma de pagamento do saldo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => atualizar("formaPagamentoSaldo", "avista")}
                  className={`flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm font-semibold transition ${
                    form.formaPagamentoSaldo === "avista"
                      ? "border-gold bg-gold/10 text-gold-dark"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  À vista
                </button>
                <button
                  type="button"
                  onClick={() => atualizar("formaPagamentoSaldo", "financiado")}
                  className={`flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm font-semibold transition ${
                    form.formaPagamentoSaldo === "financiado"
                      ? "border-gold bg-gold/10 text-gold-dark"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Financiado
                </button>
              </div>
            </div>

            {form.formaPagamentoSaldo === "avista" && (
              <div>
                <label className={labelClass}>Pago na assinatura...</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => atualizar("momentoPagamentoAvista", "contrato")}
                    className={`flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm font-semibold transition ${
                      form.momentoPagamentoAvista === "contrato"
                        ? "border-gold bg-gold/10 text-gold-dark"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Do contrato
                  </button>
                  <button
                    type="button"
                    onClick={() => atualizar("momentoPagamentoAvista", "escritura")}
                    className={`flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm font-semibold transition ${
                      form.momentoPagamentoAvista === "escritura"
                        ? "border-gold bg-gold/10 text-gold-dark"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Da escritura
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Detalhes adicionais (opcional)</label>
              <input
                value={form.formaSaldo}
                onChange={(e) => atualizar("formaSaldo", e.target.value)}
                placeholder={
                  form.formaPagamentoSaldo === "financiado"
                    ? "Ex: financiamento pela Caixa, já aprovado..."
                    : "Ex: via boleto de quitação, TED..."
                }
                className={inputClass}
              />
            </div>

            <p className="pt-2 font-sans text-sm font-semibold text-navy">
              Dados bancários do(s) Vendedor(es) pra recebimento
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.bancoVendedor}
                onChange={(e) => atualizar("bancoVendedor", e.target.value)}
                placeholder="Banco"
                className={inputClass}
              />
              <input
                value={form.agenciaVendedor}
                onChange={(e) => atualizar("agenciaVendedor", e.target.value)}
                placeholder="Agência"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.contaVendedor}
                onChange={(e) => atualizar("contaVendedor", e.target.value)}
                placeholder="Conta corrente"
                className={inputClass}
              />
              <input
                value={form.favorecidoVendedor}
                onChange={(e) =>
                  atualizar("favorecidoVendedor", e.target.value)
                }
                placeholder="Nome do favorecido"
                className={inputClass}
              />
            </div>

          </div>

        </div>

        {/* Comissão */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Comissão de Corretagem
          </h2>

          <div className="space-y-4">

            <div>
              <label className={labelClass}>Valor da Comissão</label>
              <CampoMoeda
                value={form.valorComissao}
                onChange={(v) => atualizar("valorComissao", v)}
              />
            </div>

            <p className="font-sans text-sm font-semibold text-navy">
              Dados bancários da Dunna pra recebimento
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.bancoComissao}
                onChange={(e) => atualizar("bancoComissao", e.target.value)}
                placeholder="Banco"
                className={inputClass}
              />
              <input
                value={form.agenciaComissao}
                onChange={(e) => atualizar("agenciaComissao", e.target.value)}
                placeholder="Agência"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={form.contaComissao}
                onChange={(e) => atualizar("contaComissao", e.target.value)}
                placeholder="Conta corrente"
                className={inputClass}
              />
              <input
                value={form.pixComissao}
                onChange={(e) => atualizar("pixComissao", e.target.value)}
                placeholder="Chave Pix (opcional)"
                className={inputClass}
              />
              <input
                value={form.favorecidoComissao}
                onChange={(e) =>
                  atualizar("favorecidoComissao", e.target.value)
                }
                placeholder="Nome do favorecido"
                className={inputClass}
              />
            </div>

          </div>

        </div>

        {/* Foro, assinatura e testemunhas */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-display text-lg font-bold text-navy">
            Foro, Assinatura e Testemunhas
          </h2>

          <div className="space-y-4">

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>Comarca (foro)</label>
                <input
                  value={form.foroCidade}
                  onChange={(e) => atualizar("foroCidade", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Cidade da Assinatura</label>
                <input
                  value={form.cidadeAssinatura}
                  onChange={(e) =>
                    atualizar("cidadeAssinatura", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Data</label>
                <input
                  type="date"
                  value={form.dataAssinatura}
                  onChange={(e) => atualizar("dataAssinatura", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.testemunha1Nome}
                onChange={(e) => atualizar("testemunha1Nome", e.target.value)}
                placeholder="Testemunha 1 - Nome"
                className={inputClass}
              />
              <input
                value={form.testemunha1Cpf}
                onChange={(e) => atualizar("testemunha1Cpf", e.target.value)}
                placeholder="Testemunha 1 - CPF"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.testemunha2Nome}
                onChange={(e) => atualizar("testemunha2Nome", e.target.value)}
                placeholder="Testemunha 2 - Nome"
                className={inputClass}
              />
              <input
                value={form.testemunha2Cpf}
                onChange={(e) => atualizar("testemunha2Cpf", e.target.value)}
                placeholder="Testemunha 2 - CPF"
                className={inputClass}
              />
            </div>

          </div>

        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={salvarRascunho}
            disabled={salvando}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-navy py-5 font-sans text-lg font-semibold text-navy transition hover:bg-navy/5 disabled:opacity-60"
          >
            <Save size={20} />
            {salvando ? "Salvando..." : "Salvar Contrato"}
          </button>

          <button
            onClick={gerarPDF}
            disabled={gerando}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-navy py-5 font-sans text-lg font-semibold text-white transition hover:bg-navy/90 disabled:opacity-60"
          >
            <FileDown size={20} />
            {gerando ? "Gerando PDF..." : "Gerar Contrato em PDF"}
          </button>
        </div>

        <p className="mt-3 text-center font-sans text-xs text-slate-400">
          Salvar guarda os dados preenchidos pra continuar editando depois, sem gerar o PDF. Depois que o contrato for assinado por todos, você pode excluir o rascunho salvo pelo seletor acima.
        </p>

      </div>

    </AppShell>
  );
}
