import jsPDF from "jspdf";
import { ContratoCorretagemFormData } from "../types/contratoCorretagem";
import { valorPorExtenso } from "../utils/numeroPorExtenso";

const NAVY: [number, number, number] = [16, 24, 40];
const GOLD: [number, number, number] = [200, 169, 106];
const CINZA: [number, number, number] = [110, 118, 130];

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

// Gera o "Contrato de Prestação de Serviços de Corretagem Imobiliária e
// Recibo" — o documento simples que os clientes pedem depois de uma
// venda, servindo tanto de comprovante do serviço de intermediação
// quanto de recibo de quitação da comissão paga à Dunna. Segue o
// mesmo padrão visual (logo, cores, rodapé) dos demais documentos.
export async function gerarContratoCorretagemPDF(form: ContratoCorretagemFormData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margem = 16;
  const larguraUtil = 210 - margem * 2;
  let y = 0;

  const logoBase64 = await carregarImagemBase64("/logo/logodunna2.png");

  function novaLinhaSePrecisar(altura = 8) {
    if (y + altura > 272) {
      rodapePagina();
      doc.addPage();
      y = 20;
      cabecalhoContinuacao();
    }
  }

  function cabecalhoPrincipal() {
    // Faixa navy no topo — mesmo padrão da Proposta
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
    doc.text("RECIBO DE CORRETAGEM", 210 - margem, 15, { align: "right" });

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
    doc.text("RECIBO DE CORRETAGEM · DUNNA IMÓVEIS", margem, 12);
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

  cabecalhoPrincipal();

  function tituloClausula(texto: string) {
    novaLinhaSePrecisar(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(20, 20, 20);
    const linhas = doc.splitTextToSize(texto.toUpperCase(), larguraUtil);
    doc.text(linhas, margem, y);
    y += linhas.length * 5 + 3;
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

  // Título do instrumento (o cabeçalho acima já identifica o documento)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...NAVY);
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE", 105, y, { align: "center" });
  y += 6;
  doc.text("CORRETAGEM IMOBILIÁRIA E RECIBO", 105, y, { align: "center" });
  y += 12;

  paragrafo("Pelo presente instrumento particular, de um lado:");

  tituloClausula("Contratada:");
  paragrafo(
    "DUNNA IMÓVEIS, sociedade devidamente inscrita no CNPJ nº 55.297.958/0001-88, registrada no Conselho Regional de Corretores de Imóveis sob o nº CRECI-PE 19602-J, doravante denominada simplesmente CONTRATADA."
  );

  paragrafo("E de outro lado:");

  tituloClausula("Contratante:");
  paragrafo(
    `${(form.clienteNome || "____________________________").toUpperCase()}, portador(a) do CPF nº ${
      form.clienteCpf || "____________________"
    }, residente e domiciliado(a) em ${
      form.clienteEndereco || "____________________________"
    }, doravante denominado(a) simplesmente CONTRATANTE.`
  );

  paragrafo("Têm entre si justo e contratado o que segue:");

  // Cláusula 1
  tituloClausula("Cláusula 1 – Do Objeto");
  paragrafo(
    `O presente contrato tem por objeto os serviços de intermediação e assessoria imobiliária (corretagem) prestados pela CONTRATADA ao CONTRATANTE, referentes à venda do seguinte imóvel: ${
      form.imovelDescricao || "____________________________"
    }.`
  );
  paragrafo(
    `O negócio foi concretizado pelo valor total de venda de ${formatarMoeda(
      form.valorVenda
    )} (${valorPorExtenso(Number(form.valorVenda) || 0)}).`
  );

  // Cláusula 2
  tituloClausula("Cláusula 2 – Da Comissão de Corretagem");
  paragrafo(
    `Pelos serviços de intermediação prestados, foi ajustada entre as partes a comissão de corretagem no valor de ${formatarMoeda(
      form.valorCorretagem
    )} (${valorPorExtenso(Number(form.valorCorretagem) || 0)})${
      form.formaPagamentoCorretagem ? `, paga ${form.formaPagamentoCorretagem}` : ""
    }.`
  );

  // Cláusula 3
  tituloClausula("Cláusula 3 – Do Recibo e Quitação");
  paragrafo(
    "A CONTRATADA declara, para os devidos fins, ter recebido do CONTRATANTE a integralidade do valor mencionado na Cláusula 2, referente à comissão de corretagem acima descrita, dando-lhe, por este ato, plena, geral, rasa e irrevogável quitação, nada mais havendo a reclamar a qualquer título relacionado à prestação destes serviços."
  );

  // Cláusula 4
  tituloClausula("Cláusula 4 – Do Foro");
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

  linhaAssinatura(
    "Dunna Imóveis",
    form.corretorResponsavel
      ? `${form.corretorResponsavel}${form.corretorCreci ? ` — CRECI ${form.corretorCreci}` : ""} (CONTRATADA)`
      : "CONTRATADA"
  );
  linhaAssinatura(form.clienteNome || "Contratante", "CONTRATANTE");

  rodapePagina();

  const nomeArquivo = `Recibo-Corretagem-${form.clienteNome || "sem-nome"}-${Date.now()}.pdf`;
  doc.save(nomeArquivo);
}
