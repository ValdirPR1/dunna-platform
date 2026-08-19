// Tradução automática de conteúdo que vem do banco (descrição de
// imóvel, texto de empreendimento, resumo de post do blog,
// comentário de avaliação...) — coisas que o Valdir digita em
// português e que agora também precisam aparecer em inglês/espanhol
// pra quem troca o idioma do site.
//
// Usa a MyMemory (api.mymemory.translated.net), tradução automática
// gratuita e sem chave. Se a API falhar ou estourar o limite diário,
// a função devolve o texto original em português — nunca quebra a
// página, só deixa de traduzir aquele trecho.

export type IdiomaAlvo = "en" | "es";

const LIMITE_CARACTERES_POR_PEDACO = 480;
const MAXIMO_PEDACOS = 20; // ~9.600 caracteres — acima disso, não traduz (evita estourar a cota gratuita em textos enormes)

function dividirEmPedacos(texto: string): string[] {
  const paragrafos = texto.split(/\n+/).filter((p) => p.length > 0);
  const pedacos: string[] = [];
  let atual = "";

  function fecharAtual() {
    if (atual) {
      pedacos.push(atual);
      atual = "";
    }
  }

  for (const paragrafo of paragrafos) {
    if (paragrafo.length > LIMITE_CARACTERES_POR_PEDACO) {
      fecharAtual();
      // Parágrafo grande demais sozinho: quebra por frases
      const frases = paragrafo.match(/[^.!?]+[.!?]*\s*/g) ?? [paragrafo];
      let bloco = "";
      for (const frase of frases) {
        if ((bloco + frase).length > LIMITE_CARACTERES_POR_PEDACO) {
          if (bloco) pedacos.push(bloco.trim());
          bloco = frase;
        } else {
          bloco += frase;
        }
      }
      if (bloco) pedacos.push(bloco.trim());
      continue;
    }

    const candidato = atual ? `${atual}\n${paragrafo}` : paragrafo;
    if (candidato.length > LIMITE_CARACTERES_POR_PEDACO) {
      fecharAtual();
      atual = paragrafo;
    } else {
      atual = candidato;
    }
  }
  fecharAtual();

  return pedacos;
}

async function traduzirPedaco(
  pedaco: string,
  idioma: IdiomaAlvo
): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      pedaco
    )}&langpair=pt|${idioma}`;

    const resposta = await fetch(url, {
      // Traduções não mudam — cacheia por 30 dias
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (!resposta.ok) return null;

    const dados = await resposta.json();
    const traduzido: string | undefined = dados?.responseData?.translatedText;

    if (!traduzido) return null;

    // A MyMemory devolve status 200 mesmo quando estourou a cota ou
    // rejeitou o pedido — o aviso vem dentro do próprio texto.
    const pareceAviso =
      /MYMEMORY WARNING|QUOTA|INVALID/i.test(traduzido) &&
      traduzido.length < 200;

    if (pareceAviso) return null;

    return traduzido;
  } catch (error) {
    console.error("Falha ao traduzir trecho:", error);
    return null;
  }
}

// Traduz um texto simples (sem HTML). Se qualquer pedaço falhar,
// devolve o texto original completo — melhor mostrar em português do
// que misturar partes traduzidas com partes não traduzidas.
export async function traduzirTexto(
  texto: string,
  idioma: IdiomaAlvo
): Promise<string> {
  const textoLimpo = texto.trim();
  if (!textoLimpo) return texto;

  const pedacos = dividirEmPedacos(textoLimpo);

  if (pedacos.length > MAXIMO_PEDACOS) return texto;

  const traduzidos = await Promise.all(
    pedacos.map((pedaco) => traduzirPedaco(pedaco, idioma))
  );

  if (traduzidos.some((t) => t === null)) return texto;

  return traduzidos.join("\n");
}

// Traduz HTML simples (parágrafos, títulos, listas) preservando as
// tags — só manda pra API o texto que fica entre elas. Não é um
// parser de verdade (não lida com HTML muito complexo/aninhado), mas
// cobre bem o que o editor de posts do blog produz.
export async function traduzirHtml(
  html: string,
  idioma: IdiomaAlvo
): Promise<string> {
  const htmlLimpo = html.trim();
  if (!htmlLimpo) return html;

  const partes = htmlLimpo.split(/(<[^>]+>)/g);

  const totalTexto = partes
    .filter((p) => !p.startsWith("<"))
    .join("").length;

  if (totalTexto > MAXIMO_PEDACOS * LIMITE_CARACTERES_POR_PEDACO) return html;

  const traduzidas = await Promise.all(
    partes.map(async (parte) => {
      if (parte.startsWith("<")) return parte;
      if (!parte.trim()) return parte;

      const traduzido = await traduzirTexto(parte.trim(), idioma);

      // Preserva espaços em volta do texto original (ex.: espaço antes
      // de uma tag de fechamento)
      const espacoAntes = parte.match(/^\s*/)?.[0] ?? "";
      const espacoDepois = parte.match(/\s*$/)?.[0] ?? "";
      return `${espacoAntes}${traduzido}${espacoDepois}`;
    })
  );

  return traduzidas.join("");
}
