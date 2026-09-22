import jsPDF from "jspdf";
import { AutorizacaoVendaFormData } from "../types/autorizacaoVenda";
import { valorPorExtenso, numeroPorExtenso } from "../utils/numeroPorExtenso";

// Percentual por extenso, sem sufixo de moeda — ex: "5" -> "cinco";
// "2.5" -> "dois vírgula cinco".
function percentualPorExtenso(valor: string): string {
  const numero = Number(valor) || 0;
  const inteiro = Math.floor(numero);
  const decimal = Math.round((numero - inteiro) * 10);

  if (decimal === 0) return numeroPorExtenso(inteiro);
  return `${numeroPorExtenso(inteiro)} vírgula ${numeroPorExtenso(decimal)}`;
}

function formatarMoeda(valor: string) {
  const numero = Number(valor);
  if (!valor || isNaN(numero)) return "R$ 0,00";
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataPorExtenso(valor: string) {
  if (!valor) return "____ de __________ de ______";
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
    "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  const [ano, mes, dia] = valor.split("-");
  if (!ano || !mes || !dia) return valor;
  return `${Number(dia)} de ${meses[Number(mes) - 1]} de ${ano}`;
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

// Gera o "Termo de Autorização para Venda e Divulgação de Imóvel" —
// assinado pelo proprietário no momento da captação, autorizando a
// Dunna a divulgar o imóvel (redes sociais, plataformas, placa) e
// deixando registrado, por escrito, que ele está ciente da comissão
// de corretagem descontada do valor final de venda.
export async function gerarAutorizacaoVendaPDF(form: AutorizacaoVendaFormData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margem = 20;
  const larguraUtil = 210 - margem * 2;
  let y = 20;

  const logoBase64 = await carregarImagemBase64("/logo/dunna-site.png");

  // Nome da cláusula "em andamento" — usado pra repetir o título como
  // "(continuação)" quando um parágrafo longo quebra pro meio de
  // outra página.
  let clausulaAtual = "";

  function novaLinhaSePrecisar(altura = 8) {
    if (y + altura > 270) {
      rodape();
      doc.addPage();
      cabecalho();
    }
  }

  function rodape() {
    const pagina = doc.getNumberOfPages();
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margem, 280, margem + larguraUtil, 280);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      "Dunna Imóveis · CNPJ 55.297.958/0001-88 · CRECI-PE 19602-J",
      margem,
      285
    );
    doc.text(`página ${pagina}`, margem + larguraUtil, 285, {
      align: "right",
    });
  }

  function cabecalho() {
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", margem, 10.5, 40, 19.5);
      } catch {}
    }

    doc.setDrawColor(200, 169, 106);
    doc.setLineWidth(0.6);
    doc.line(margem, 32, margem + larguraUtil, 32);

    y = 42;

    if (clausulaAtual) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      doc.text(`${clausulaAtual.toUpperCase()} (continuação)`, margem, y);
      y += 8;
    }
  }

  cabecalho();

  function tituloClausula(texto: string) {
    clausulaAtual = "";

    // Reserva espaço do título + um pedaço do texto seguinte, senão
    // o título fica sozinho no fim da página e o parágrafo pula
    // inteiro pra próxima, órfão logo abaixo do cabeçalho.
    novaLinhaSePrecisar(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(20, 20, 20);
    const linhas = doc.splitTextToSize(texto.toUpperCase(), larguraUtil);
    doc.text(linhas, margem, y);
    y += linhas.length * 5 + 3;

    clausulaAtual = texto;
  }

  function paragrafo(texto: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const linhas = doc.splitTextToSize(texto, larguraUtil);
    novaLinhaSePrecisar(linhas.length * 5 + 4);
    doc.text(linhas, margem, y, { align: "justify", maxWidth: larguraUtil });
    y += linhas.length * 5 + 4;
  }

  function itemLista(texto: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const linhas = doc.splitTextToSize(`•  ${texto}`, larguraUtil - 4);
    novaLinhaSePrecisar(linhas.length * 5 + 3);
    doc.text(linhas, margem + 3, y);
    y += linhas.length * 5 + 3;
  }

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text("AUTORIZAÇÃO PARA VENDA E DIVULGAÇÃO", 105, y, { align: "center" });
  y += 6;
  doc.text("DE IMÓVEL", 105, y, { align: "center" });
  y += 12;

  paragrafo("Pelo presente instrumento particular, de um lado:");

  tituloClausula("Proprietário(a):");
  paragrafo(
    `${(form.proprietarioNome || "____________________________").toUpperCase()}${
      form.proprietarioCpf ? `, portador(a) do CPF nº ${form.proprietarioCpf}` : ""
    }${form.proprietarioRg ? `, RG nº ${form.proprietarioRg}` : ""}${
      form.proprietarioEndereco ? `, residente e domiciliado(a) em ${form.proprietarioEndereco}` : ""
    }${form.proprietarioTelefone ? `, telefone ${form.proprietarioTelefone}` : ""}${
      form.proprietarioEmail ? `, e-mail ${form.proprietarioEmail}` : ""
    }, doravante denominado(a) simplesmente PROPRIETÁRIO(A).`
  );

  paragrafo("E de outro lado:");

  tituloClausula("Imobiliária:");
  paragrafo(
    "DUNNA IMÓVEIS, sociedade devidamente inscrita no CNPJ nº 55.297.958/0001-88, registrada no Conselho Regional de Corretores de Imóveis sob o nº CRECI-PE 19602-J, doravante denominada simplesmente DUNNA IMÓVEIS."
  );

  paragrafo("Têm entre si justo e contratado o que segue:");

  // Cláusula 1
  tituloClausula("Cláusula 1 – Do Imóvel");
  paragrafo(
    `O presente instrumento tem como objeto o seguinte imóvel de propriedade do(a) PROPRIETÁRIO(A): ${
      form.imovelTipo || "imóvel"
    } localizado em ${form.imovelEndereco || "____________________________"}${
      form.imovelBairro ? `, bairro ${form.imovelBairro}` : ""
    }${form.imovelCidade ? `, ${form.imovelCidade}${form.imovelEstado ? `-${form.imovelEstado}` : ""}` : ""}${
      form.imovelMatricula ? `, matrícula nº ${form.imovelMatricula}` : ""
    }.`
  );
  paragrafo(
    `O valor pretendido para a venda do imóvel é de ${formatarMoeda(form.valorPretendido)} (${valorPorExtenso(
      Number(form.valorPretendido) || 0
    )}), podendo ser ajustado de comum acordo entre as partes conforme as condições de mercado.`
  );

  // Cláusula 2
  tituloClausula("Cláusula 2 – Da Autorização de Divulgação");
  paragrafo(
    "O(A) PROPRIETÁRIO(A) autoriza, de forma expressa e gratuita, a DUNNA IMÓVEIS a:"
  );
  itemLista(
    "Divulgar o imóvel descrito na Cláusula 1 em redes sociais, site próprio e demais plataformas e portais imobiliários;"
  );
  itemLista("Fixar placa de venda no imóvel;");
  itemLista(
    "Realizar fotos e vídeos do imóvel para uso exclusivo em materiais de divulgação da venda."
  );

  // Cláusula 3
  tituloClausula("Cláusula 3 – Da Comissão de Corretagem");
  paragrafo(
    `O(A) PROPRIETÁRIO(A) declara estar ciente de que, caso a venda do imóvel se concretize por intermédio da DUNNA IMÓVEIS, será devida a comissão de corretagem no percentual de ${
      form.percentualComissao || "5"
    }% (${percentualPorExtenso(form.percentualComissao)} por cento) sobre o valor final de venda do imóvel, a qual será descontada diretamente do valor recebido pelo(a) PROPRIETÁRIO(A) no ato da venda.`
  );

  // Cláusula 4
  tituloClausula("Cláusula 4 – Da Vigência e Revogação");
  paragrafo(
    "Esta autorização vigora por prazo indeterminado, a partir da data de sua assinatura, podendo ser revogada por qualquer das partes mediante comunicação por escrito, sem prejuízo dos compromissos já assumidos com terceiros até a data da revogação."
  );

  if (form.observacoes) {
    tituloClausula("Cláusula 5 – Observações");
    paragrafo(form.observacoes);
  }

  // Cláusula final
  tituloClausula(`Cláusula ${form.observacoes ? "6" : "5"} – Do Foro`);
  paragrafo(
    `Fica eleito o foro da comarca de ${
      form.cidadeAssinatura || "____________________"
    }, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir eventuais dúvidas oriundas deste instrumento.`
  );

  paragrafo(
    "E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma."
  );

  novaLinhaSePrecisar(10);
  paragrafo(
    `${form.cidadeAssinatura || "____________________"}, ${formatarDataPorExtenso(form.dataAssinatura)}.`
  );

  // Assinaturas
  novaLinhaSePrecisar(30);
  y += 10;

  function linhaAssinatura(nome: string, papel: string) {
    novaLinhaSePrecisar(20);
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.3);
    doc.line(margem, y, margem + larguraUtil, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(nome.toUpperCase(), 105, y, { align: "center" });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(papel, 105, y, { align: "center" });
    y += 12;
  }

  linhaAssinatura(form.proprietarioNome || "Proprietário(a)", "PROPRIETÁRIO(A)");
  linhaAssinatura("Dunna Imóveis", "DUNNA IMÓVEIS");

  novaLinhaSePrecisar(24);
  const meioColuna = margem + larguraUtil / 2;

  doc.setDrawColor(80, 80, 80);
  doc.line(margem, y, margem + 75, y);
  doc.line(meioColuna + 10, y, meioColuna + 10 + 75, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("TESTEMUNHA", margem, y);
  doc.text("TESTEMUNHA", meioColuna + 10, y);
  y += 6;

  doc.text(`Nome: ${form.testemunha1Nome || "_______________________"}`, margem, y);
  doc.text(`Nome: ${form.testemunha2Nome || "_______________________"}`, meioColuna + 10, y);
  y += 6;

  doc.text(`CPF: ${form.testemunha1Cpf || "_______________________"}`, margem, y);
  doc.text(`CPF: ${form.testemunha2Cpf || "_______________________"}`, meioColuna + 10, y);

  rodape();

  const nomeArquivo = `Autorizacao-Venda-${form.proprietarioNome || "sem-nome"}-${Date.now()}.pdf`;
  doc.save(nomeArquivo);
}
