import { jsPDF } from "jspdf";
import { obterDadosRelatorio } from "../services/relatorio.service";

const NAVY: [number, number, number] = [16, 24, 40];
const GOLD: [number, number, number] = [200, 169, 106];
const GOLD_DARK: [number, number, number] = [166, 124, 46];
const EMERALD: [number, number, number] = [16, 150, 100];
const SLATE: [number, number, number] = [100, 116, 139];
const SLATE_LIGHT: [number, number, number] = [226, 232, 240];
const RED: [number, number, number] = [220, 60, 60];

const MARGEM = 16;
const LARGURA_PAGINA = 210;
const LARGURA_UTIL = LARGURA_PAGINA - MARGEM * 2;

function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Gera e baixa o PDF com o relatório mensal de desempenho de um
// corretor: leads recebidos, funil atual, metas x realizado (que já
// vem calculado automaticamente do CRM) e presença em reuniões/
// treinamentos. Pensado pra imprimir/mostrar numa reunião de equipe.
export async function gerarRelatorioCorretor(corretorId: string, corretorNome: string) {
  const dados = await obterDadosRelatorio(corretorId, corretorNome);
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  let y = 0;

  // ---- Cabeçalho ----
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, LARGURA_PAGINA, 34, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Relatório de Desempenho", MARGEM, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(dados.corretorNome, MARGEM, 24);

  doc.setTextColor(...GOLD);
  doc.setFontSize(10);
  doc.text(capitalizar(dados.periodoRotulo), MARGEM, 30);

  y = 44;

  // ---- Resumo do mês ----
  const resumo = [
    { label: "Leads recebidos", valor: String(dados.leadsRecebidos) },
    { label: "Leads ativos na base", valor: String(dados.totalAtivos) },
    { label: "Vendas fechadas", valor: String(dados.metricas.find((m) => m.tipo === "vendas")?.realizado ?? 0) },
    { label: "Reuniões/treinamentos", valor: String(dados.eventosParticipados.length) },
  ];

  const larguraCard = (LARGURA_UTIL - 3 * 4) / 4;
  resumo.forEach((item, i) => {
    const x = MARGEM + i * (larguraCard + 4);
    doc.setFillColor(...SLATE_LIGHT);
    doc.roundedRect(x, y, larguraCard, 20, 2, 2, "F");

    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(item.valor, x + larguraCard / 2, y + 10, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text(item.label, x + larguraCard / 2, y + 16, { align: "center", maxWidth: larguraCard - 4 });
  });

  y += 30;

  // ---- Metas x Realizado ----
  y = tituloSecao(doc, "Metas x Realizado", y);

  dados.metricas.forEach((m) => {
    y = barraMetrica(doc, y, `${m.label} (${m.labelPeriodo})`, m.realizado, m.alvo);
  });

  y += 4;

  // ---- Funil de vendas ----
  y = tituloSecao(doc, "Funil de vendas (situação atual)", y);

  const maxFunil = Math.max(1, ...dados.funil.map((f) => f.quantidade));
  dados.funil.forEach((f) => {
    y = barraSimples(doc, y, f.etapa, f.quantidade, maxFunil, GOLD);
  });

  y += 4;

  // ---- Reuniões / treinamentos ----
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  y = tituloSecao(doc, "Reuniões de equipe e treinamentos no mês", y);

  if (dados.eventosParticipados.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...SLATE);
    doc.text("Nenhuma participação confirmada pelo master neste período.", MARGEM, y);
    y += 8;
  } else {
    dados.eventosParticipados.forEach((evento) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...NAVY);
      const dataFormatada = evento.data
        ? new Date(evento.data).toLocaleDateString("pt-BR")
        : "";
      doc.text(`•  ${evento.titulo}`, MARGEM, y);
      doc.setTextColor(...SLATE);
      doc.text(dataFormatada, LARGURA_PAGINA - MARGEM, y, { align: "right" });
      y += 6;
    });
  }

  // ---- Rodapé ----
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setDrawColor(...SLATE_LIGHT);
    doc.line(MARGEM, 287, LARGURA_PAGINA - MARGEM, 287);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...GOLD_DARK);
    doc.text("Venda não é sorte, é processo.", MARGEM, 292);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString("pt-BR")} • ${i}/${totalPaginas}`,
      LARGURA_PAGINA - MARGEM,
      292,
      { align: "right" }
    );
  }

  const nomeArquivo = `relatorio-${dados.corretorNome.toLowerCase().replace(/\s+/g, "-")}-${dados.periodoInicio}.pdf`;
  doc.save(nomeArquivo);
}

function tituloSecao(doc: jsPDF, titulo: string, y: number): number {
  if (y > 260) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  doc.text(titulo, MARGEM, y);

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(MARGEM, y + 2, MARGEM + 22, y + 2);

  return y + 9;
}

// Barra de progresso "realizado / alvo" — verde quando bate a meta,
// dourado enquanto está em andamento.
function barraMetrica(doc: jsPDF, y: number, label: string, realizado: number, alvo: number): number {
  if (y > 270) {
    doc.addPage();
    y = 20;
  }

  const bateu = alvo > 0 && realizado >= alvo;
  const percentual = alvo > 0 ? Math.min(1, realizado / alvo) : 0;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  doc.text(label, MARGEM, y);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(bateu ? EMERALD[0] : NAVY[0], bateu ? EMERALD[1] : NAVY[1], bateu ? EMERALD[2] : NAVY[2]);
  doc.text(`${realizado} / ${alvo}`, LARGURA_PAGINA - MARGEM, y, { align: "right" });

  const barY = y + 2;
  const barAltura = 3;
  doc.setFillColor(...SLATE_LIGHT);
  doc.roundedRect(MARGEM, barY, LARGURA_UTIL, barAltura, 1.5, 1.5, "F");

  const largura = Math.max(percentual * LARGURA_UTIL, percentual > 0 ? 3 : 0);
  if (largura > 0) {
    doc.setFillColor(...(bateu ? EMERALD : GOLD));
    doc.roundedRect(MARGEM, barY, largura, barAltura, 1.5, 1.5, "F");
  }

  return y + 11;
}

// Barra horizontal simples pra contagens (ex: funil por etapa)
function barraSimples(
  doc: jsPDF,
  y: number,
  label: string,
  valor: number,
  maximo: number,
  cor: [number, number, number]
): number {
  if (y > 270) {
    doc.addPage();
    y = 20;
  }

  const larguraLabel = 45;
  const larguraBarraMax = LARGURA_UTIL - larguraLabel - 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text(label, MARGEM, y + 3.5, { maxWidth: larguraLabel - 2 });

  const proporcao = maximo > 0 ? valor / maximo : 0;
  const largura = Math.max(proporcao * larguraBarraMax, valor > 0 ? 2 : 0);

  doc.setFillColor(...SLATE_LIGHT);
  doc.roundedRect(MARGEM + larguraLabel, y, larguraBarraMax, 5, 1.2, 1.2, "F");

  if (largura > 0) {
    doc.setFillColor(...cor);
    doc.roundedRect(MARGEM + larguraLabel, y, largura, 5, 1.2, 1.2, "F");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text(String(valor), MARGEM + larguraLabel + larguraBarraMax + 4, y + 4);

  return y + 9;
}
