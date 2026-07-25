const UNIDADES = [
  "", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
];
const DEZ_A_DEZENOVE = [
  "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis",
  "dezessete", "dezoito", "dezenove",
];
const DEZENAS = [
  "", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta",
  "oitenta", "noventa",
];
const CENTENAS = [
  "", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",
  "seiscentos", "setecentos", "oitocentos", "novecentos",
];

function grupoPorExtenso(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";

  let partes: string[] = [];

  const centena = Math.floor(n / 100);
  const resto = n % 100;

  if (centena > 0) partes.push(CENTENAS[centena]);

  if (resto > 0) {
    if (resto < 10) {
      partes.push(UNIDADES[resto]);
    } else if (resto < 20) {
      partes.push(DEZ_A_DEZENOVE[resto - 10]);
    } else {
      const dezena = Math.floor(resto / 10);
      const unidade = resto % 10;
      let texto = DEZENAS[dezena];
      if (unidade > 0) texto += ` e ${UNIDADES[unidade]}`;
      partes.push(texto);
    }
  }

  return partes.join(" e ");
}

function numeroInteiroPorExtenso(n: number): string {
  if (n === 0) return "zero";

  const milhoes = Math.floor(n / 1_000_000);
  const milhares = Math.floor((n % 1_000_000) / 1000);
  const centenas = n % 1000;

  let partes: string[] = [];

  if (milhoes > 0) {
    partes.push(
      milhoes === 1
        ? "um milhão"
        : `${grupoPorExtenso(milhoes)} milhões`
    );
  }

  if (milhares > 0) {
    partes.push(
      milhares === 1 ? "mil" : `${grupoPorExtenso(milhares)} mil`
    );
  }

  if (centenas > 0) {
    partes.push(grupoPorExtenso(centenas));
  }

  return partes.join(" e ");
}

/**
 * Converte um valor numérico em reais pro formato por extenso usado em
 * contratos, ex: 345000 -> "trezentos e quarenta e cinco mil reais"
 */
export function valorPorExtenso(valor: number): string {
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);

  const textoReais = numeroInteiroPorExtenso(inteiro);
  const sufixoReais = inteiro === 1 ? "real" : "reais";

  if (centavos === 0) {
    return `${textoReais} ${sufixoReais}`;
  }

  const textoCentavos = numeroInteiroPorExtenso(centavos);
  const sufixoCentavos = centavos === 1 ? "centavo" : "centavos";

  return `${textoReais} ${sufixoReais} e ${textoCentavos} ${sufixoCentavos}`;
}
