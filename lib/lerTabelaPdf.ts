import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export interface LinhaUnidade {
  unidade: string;
  torre: string;
  area: string;
  valor: string;
}

export async function lerTabelaDePrecos(file: File): Promise<{
  linhas: LinhaUnidade[];
  textoBruto: string;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let textoCompleto = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const pagina = await pdf.getPage(i);
    const conteudo = await pagina.getTextContent();

    const linhasPorY = new Map<number, string[]>();

    for (const item of conteudo.items as any[]) {
      const y = Math.round(item.transform[5]);
      const lista = linhasPorY.get(y) ?? [];
      lista.push(item.str);
      linhasPorY.set(y, lista);
    }

    const linhasOrdenadas = [...linhasPorY.entries()].sort(
      (a, b) => b[0] - a[0]
    );

    for (const [, textos] of linhasOrdenadas) {
      textoCompleto += textos.join(" ") + "\n";
    }
  }

  const linhas = extrairLinhas(textoCompleto);

  return { linhas, textoBruto: textoCompleto };
}

// Reconhece "Torre A", "Torre 1", "Bloco B", "Bloco 02" como início de
// um novo grupo — tudo que vier depois pertence a essa torre/bloco,
// até aparecer uma nova ocorrência
const PADRAO_TORRE_BLOCO = /^\s*(torre|bloco)\s*[:\-]?\s*([A-Za-zÀ-ú0-9]+)/i;

// Identifica a unidade e a área no começo da linha
const PADRAO_UNIDADE_AREA =
  /(\d{2,4}[A-Za-z]?)\D{1,15}?(\d{1,3}(?:[.,]\d{1,2})?)\s*m?²?/;

// Encontra TODOS os valores em R$ na linha — algumas tabelas trazem
// mais de um (ex: valor do m² e o valor total). O que a gente quer
// é sempre o valor TOTAL, que normalmente é o último da linha.
const PADRAO_TODOS_OS_VALORES = /R\$\s*([\d][\d.,\s]*\d|\d)/g;

function limparValorNumerico(valorBruto: string): string {
  // Remove qualquer espaço no meio do número (o motivo mais comum do
  // valor ficar errado na casa dos milhões)
  const semEspacos = valorBruto.replace(/\s/g, "");

  // Formato brasileiro: ponto separa milhar, vírgula separa decimal
  return semEspacos.replace(/\./g, "").replace(",", ".");
}

function extrairLinhas(texto: string): LinhaUnidade[] {
  const resultado: LinhaUnidade[] = [];
  const linhasTexto = texto.split("\n");

  let torreAtual = "";

  for (const linha of linhasTexto) {
    const matchTorre = linha.match(PADRAO_TORRE_BLOCO);

    if (matchTorre) {
      torreAtual = `${matchTorre[1]} ${matchTorre[2]}`;
      continue;
    }

    const matchUnidadeArea = linha.match(PADRAO_UNIDADE_AREA);
    if (!matchUnidadeArea) continue;

    const todosOsValores = [...linha.matchAll(PADRAO_TODOS_OS_VALORES)];
    if (todosOsValores.length === 0) continue;

    // Sempre pega o ÚLTIMO valor em R$ da linha — é o valor total,
    // que fica no final da tabela na grande maioria dos casos
    const ultimoValor = todosOsValores[todosOsValores.length - 1][1];

    const [, unidade, area] = matchUnidadeArea;

    resultado.push({
      unidade: unidade.trim(),
      torre: torreAtual,
      area: area.replace(",", "."),
      valor: limparValorNumerico(ultimoValor),
    });
  }

  return resultado;
}
