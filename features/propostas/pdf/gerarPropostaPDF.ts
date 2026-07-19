import jsPDF from "jspdf";
import { PropostaFormData } from "../types/proposta";

const TEXTO_LEGAL = `No ato da assinatura ou aceite desta proposta, seja física, digital ou por concordância via e-mail e ou mensagem de aplicativos de "Chat", o(s) consumidore(s) PROPONENTE(S) tê(ê)m conhecimento sobre a contratação dos serviços de CORRETAGEM IMOBILIÁRIA prestados por DUNNA IMÓVEIS, empresa imobiliária inscrita no CNPJ 55.297.958/0001-88 e devidamente registrada no conselho de classe sob o CRECI JURÍDICO nº 19602 no CRECI 7º Região Pernambuco. Pelo exposto, uma vez efetivado negócio de qualquer natureza fica ajustado o pagamento dos honorários da corretagem imobiliária por parte da construtora, incorporadora ou proprietário do imóvel avulso de acordo com o valor publicado, ofertado ou negociado entre as partes, devendo serem pagos na forma do Artigo 3º, da Lei nº 6.530/78 c/c o Artigo 724 do Código Civil.`;

const NAVY: [number, number, number] = [16, 24, 40];
const GOLD: [number, number, number] = [200, 169, 106];
const CINZA: [number, number, number] = [110, 118, 130];
const CINZA_CLARO: [number, number, number] = [245, 246, 248];

function formatarMoeda(valor: string) {
  if (!valor) return "—";
  const numero = Number(valor);
  if (isNaN(numero)) return valor;
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarDataBR(valor: string) {
  if (!valor) return "—";
  const [ano, mes, dia] = valor.split("-");
  if (!ano || !mes || !dia) return valor;
  return `${dia}/${mes}/${ano}`;
}

function carregarImagemBase64(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function gerarPropostaPDF(form: PropostaFormData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margem = 16;
  const larguraUtil = 210 - margem * 2;
  let y = 0;

  const logoBase64 = await carregarImagemBase64("/logo/logodunna2.png");

  function novaLinhaSePrecisar(alturaNecessaria = 8) {
    if (y + alturaNecessaria > 272) {
      rodapePagina();
      doc.addPage();
      y = 20;
      cabecalhoContinuacao();
    }
  }

  function cabecalhoPrincipal() {
    // Faixa navy no topo
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, 210, 34, "F");

    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", margem, 5, 56, 24);
      } catch {}
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PROPOSTA DE COMPRA", 210 - margem, 15, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(220, 220, 220);
    doc.text("CNPJ 55.297.958/0001-88", 210 - margem, 21, { align: "right" });
    doc.text("CRECI-PE nº 19602-J", 210 - margem, 25.5, { align: "right" });

    // Linha dourada
    doc.setFillColor(...GOLD);
    doc.rect(0, 34, 210, 1.3, "F");

    y = 45;
  }

  function cabecalhoContinuacao() {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...CINZA);
    doc.text("PROPOSTA DE COMPRA · DUNNA IMÓVEIS", margem, 12);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(margem, 15, margem + larguraUtil, 15);
    y = 22;
  }

  function rodapePagina() {
    const pagina = doc.getNumberOfPages();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...CINZA);
    doc.text(
      `Dunna Imóveis · CRECI-PE 19602-J · página ${pagina}`,
      margem,
      290
    );
  }

  function tituloSecao(texto: string) {
    novaLinhaSePrecisar(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...NAVY);
    doc.text(texto.toUpperCase(), margem, y);

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.8);
    doc.line(margem, y + 2, margem + 22, y + 2);

    y += 9;
  }

  function linhaCampos(campos: { label: string; valor: string }[]) {
    novaLinhaSePrecisar(13);
    const largura = larguraUtil / campos.length;

    // Fundo leve atrás da linha de campos
    doc.setFillColor(...CINZA_CLARO);
    doc.roundedRect(margem - 2, y - 5, larguraUtil + 4, 12, 1.5, 1.5, "F");

    campos.forEach((campo, i) => {
      const x = margem + i * largura + 2;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...CINZA);
      doc.text(campo.label, x, y - 0.5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(campo.valor || "—", x, y + 4.5);
    });

    y += 15;
  }

  cabecalhoPrincipal();

  // Produto
  tituloSecao("Produto");
  linhaCampos([
    { label: "UNIDADE", valor: form.unidade },
    { label: "BLOCO", valor: form.bloco },
  ]);

  // 1º Proponente
  tituloSecao("1º Proponente");
  linhaCampos([
    { label: "NOME", valor: form.proponente1.nome },
    { label: "NASCIMENTO", valor: formatarDataBR(form.proponente1.nascimento) },
  ]);
  linhaCampos([
    { label: "CPF", valor: form.proponente1.cpf },
    { label: "RG", valor: form.proponente1.rg },
    { label: "ÓRGÃO EMISSOR", valor: form.proponente1.orgaoEmissor },
  ]);
  linhaCampos([
    { label: "ESTADO CIVIL", valor: form.proponente1.estadoCivil },
    { label: "PROFISSÃO", valor: form.proponente1.profissao },
  ]);
  linhaCampos([
    { label: "E-MAIL", valor: form.proponente1.email },
    { label: "TELEFONE", valor: form.proponente1.telefone },
  ]);
  linhaCampos([
    { label: "ENDEREÇO", valor: form.proponente1.endereco },
    { label: "BAIRRO", valor: form.proponente1.bairro },
  ]);
  linhaCampos([
    { label: "CIDADE", valor: form.proponente1.cidade },
    { label: "UF", valor: form.proponente1.uf },
    { label: "CEP", valor: form.proponente1.cep },
  ]);

  // 2º Proponente
  if (form.temSegundoProponente) {
    tituloSecao("2º Comprador(a)");
    linhaCampos([
      { label: "NOME", valor: form.proponente2.nome },
      { label: "NASCIMENTO", valor: formatarDataBR(form.proponente2.nascimento) },
    ]);
    linhaCampos([
      { label: "CPF", valor: form.proponente2.cpf },
      { label: "RG", valor: form.proponente2.rg },
      { label: "ÓRGÃO EMISSOR", valor: form.proponente2.orgaoEmissor },
    ]);
    linhaCampos([
      { label: "ESTADO CIVIL", valor: form.proponente2.estadoCivil },
      { label: "PROFISSÃO", valor: form.proponente2.profissao },
    ]);
    linhaCampos([
      { label: "E-MAIL", valor: form.proponente2.email },
      { label: "TELEFONE", valor: form.proponente2.telefone },
    ]);
    linhaCampos([
      { label: "ENDEREÇO", valor: form.proponente2.endereco },
      { label: "BAIRRO", valor: form.proponente2.bairro },
    ]);
    linhaCampos([
      { label: "CIDADE", valor: form.proponente2.cidade },
      { label: "UF", valor: form.proponente2.uf },
      { label: "CEP", valor: form.proponente2.cep },
    ]);
  }

  // Fluxo de pagamento
  tituloSecao("Fluxo de Pagamento");

  linhaCampos([
    { label: "SINAL", valor: formatarMoeda(form.sinal) },
    { label: "DATA PAGAMENTO", valor: formatarDataBR(form.sinalData) },
  ]);

  if (form.temComplementoSinal) {
    linhaCampos([
      {
        label: "COMPLEMENTO DE SINAL (VALOR DA PARCELA)",
        valor: formatarMoeda(form.complementoSinal),
      },
      { label: "QUANTIDADE", valor: `${form.complementoSinalParcelas}x` },
      {
        label: "DATA PAGAMENTO",
        valor: formatarDataBR(form.complementoSinalData),
      },
    ]);
  }

  linhaCampos([
    { label: "PARCELAS MENSAIS (VALOR DA PARCELA)", valor: formatarMoeda(form.mensais) },
    { label: "QUANTIDADE", valor: `${form.mensaisParcelas}x` },
    { label: "DATA PAGAMENTO", valor: formatarDataBR(form.mensaisData) },
  ]);

  if (form.temIntercaladas) {
    linhaCampos([
      {
        label: "PARCELAS INTERCALADAS (VALOR DA PARCELA)",
        valor: formatarMoeda(form.intercaladas),
      },
      { label: "QUANTIDADE", valor: `${form.intercaladasParcelas}x` },
      { label: "PERÍODO", valor: form.intercaladasPeriodo },
    ]);
    linhaCampos([
      {
        label: "DATA PAGAMENTO (1ª PARCELA)",
        valor: formatarDataBR(form.intercaladasData),
      },
    ]);
  }

  linhaCampos([
    { label: "CHAVES", valor: formatarMoeda(form.chaves) },
    { label: "DATA PAGAMENTO", valor: formatarDataBR(form.chavesData) },
  ]);

  linhaCampos([
    { label: "FINANCIAMENTO", valor: formatarMoeda(form.financiamento) },
    { label: "DATA PAGAMENTO", valor: formatarDataBR(form.financiamentoData) },
  ]);

  // Total em destaque
  novaLinhaSePrecisar(22);
  doc.setFillColor(...NAVY);
  doc.roundedRect(margem, y, larguraUtil, 18, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(200, 200, 200);
  doc.text("TOTAL DA PROPOSTA", margem + 6, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...GOLD);
  doc.text(formatarMoeda(form.totalProposta), margem + 6, y + 14);
  y += 26;

  // Observações
  if (form.observacoes) {
    tituloSecao("Observações");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const linhasObs = doc.splitTextToSize(form.observacoes, larguraUtil);
    novaLinhaSePrecisar(linhasObs.length * 5 + 5);
    doc.text(linhasObs, margem, y);
    y += linhasObs.length * 5 + 8;
  }

  // Assinaturas
  novaLinhaSePrecisar(36);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `${form.cidadeAssinatura || "____________"}, ${formatarDataBR(form.dataAssinatura)}`,
    margem,
    y
  );
  y += 22;

  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.3);
  doc.line(margem, y, margem + 80, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text("COMPRADOR", margem, y + 5);

  doc.line(margem + 100, y, margem + 180, y);
  doc.text(
    (form.corretorResponsavel || "CORRETOR RESPONSÁVEL").toUpperCase(),
    margem + 100,
    y + 5
  );
  y += 18;

  // Texto legal
  novaLinhaSePrecisar(32);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(margem, y, margem + larguraUtil, y);
  y += 6;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.3);
  doc.setTextColor(130, 130, 130);
  const linhasLegal = doc.splitTextToSize(TEXTO_LEGAL, larguraUtil);
  doc.text(linhasLegal, margem, y);

  rodapePagina();

  const nomeArquivo = `Proposta-${form.proponente1.nome || "sem-nome"}-${Date.now()}.pdf`;
  doc.save(nomeArquivo);
}
