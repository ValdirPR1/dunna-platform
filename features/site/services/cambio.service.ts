export interface Cotacoes {
  // Quantos reais custa 1 dólar / 1 euro — pra converter um valor em
  // reais, basta dividir por esse número.
  usdParaBrl: number;
  eurParaBrl: number;
}

// Busca a cotação do dólar e do euro em reais (API pública, gratuita,
// sem chave — exchangerate-api.com). Cacheada por 1h pelo Next (câmbio
// não precisa de atualização por minuto), separado do cache da página
// em si. Se a API falhar por qualquer motivo, devolve null — quem usa
// isso decide simplesmente não mostrar o valor convertido, sem quebrar
// a página do imóvel.
//
// A API antiga (AwesomeAPI) parou de responder de forma confiável a
// partir do servidor do site, então trocamos por essa aqui, que
// devolve todas as taxas em relação ao dólar — daí a conta pra achar
// quantos reais vale 1 euro: BRL por dólar ÷ EUR por dólar.
export async function obterCotacoes(): Promise<Cotacoes | null> {
  try {
    const resposta = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });

    if (!resposta.ok) return null;

    const dados = await resposta.json();

    const usdParaBrl = Number(dados?.rates?.BRL);
    const usdParaEur = Number(dados?.rates?.EUR);

    if (!usdParaBrl || !usdParaEur) return null;

    const eurParaBrl = usdParaBrl / usdParaEur;

    return { usdParaBrl, eurParaBrl };
  } catch (error) {
    console.error("Falha ao buscar cotação USD/EUR:", error);
    return null;
  }
}
