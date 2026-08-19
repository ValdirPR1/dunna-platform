export interface Cotacoes {
  // Quantos reais custa 1 dólar / 1 euro — pra converter um valor em
  // reais, basta dividir por esse número.
  usdParaBrl: number;
  eurParaBrl: number;
}

// Busca a cotação do dólar e do euro em reais (API pública, gratuita,
// sem chave — AwesomeAPI, bastante usada no Brasil). Cacheada por 1h
// pelo Next (câmbio não precisa de atualização por minuto), separado
// do cache da página em si. Se a API falhar por qualquer motivo,
// devolve null — quem usa isso decide simplesmente não mostrar o
// valor convertido, sem quebrar a página do imóvel.
export async function obterCotacoes(): Promise<Cotacoes | null> {
  try {
    const resposta = await fetch(
      "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL",
      { next: { revalidate: 3600 } }
    );

    if (!resposta.ok) return null;

    const dados = await resposta.json();

    const usdParaBrl = Number(dados?.USDBRL?.bid);
    const eurParaBrl = Number(dados?.EURBRL?.bid);

    if (!usdParaBrl || !eurParaBrl) return null;

    return { usdParaBrl, eurParaBrl };
  } catch (error) {
    console.error("Falha ao buscar cotação USD/EUR:", error);
    return null;
  }
}
