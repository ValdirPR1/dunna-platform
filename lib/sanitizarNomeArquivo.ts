/**
 * Deixa o nome de um arquivo seguro para usar como "key" no Supabase
 * Storage. O Storage rejeita (erro "Invalid key") nomes com espaco,
 * acento ou outros caracteres especiais - e nomes assim sao muito
 * comuns na pratica (ex: "Captura de Tela 2026-07-27 as 16.28.53.jpg",
 * o nome padrao de print no Mac, ou fotos vindas do WhatsApp).
 *
 * Sem essa sanitizacao, qualquer upload com um nome de arquivo desses
 * falha com um erro 400 que nao tem nenhuma relacao obvia com o nome
 * do arquivo pra quem esta usando o sistema.
 */
export function sanitizarNomeArquivo(nome: string): string {
  const pontoFinal = nome.lastIndexOf(".");
  const temExtensao = pontoFinal > 0 && pontoFinal < nome.length - 1;

  const base = temExtensao ? nome.slice(0, pontoFinal) : nome;
  const extensao = temExtensao ? nome.slice(pontoFinal + 1) : "";

  // ̀-ͯ cobre os acentos combinantes que sobram depois do
  // normalize("NFD") (ex: transforma "a" -> "a" + acento separado,
  // aqui a gente descarta o acento e fica só com a letra base)
  const marcasDeAcento = /[̀-ͯ]/g;

  const baseLimpa = base
    .normalize("NFD")
    .replace(marcasDeAcento, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-") // qualquer outro caractere vira "-"
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);

  const extensaoLimpa = extensao.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const nomeFinal = baseLimpa || "arquivo";
  return extensaoLimpa ? `${nomeFinal}.${extensaoLimpa}` : nomeFinal;
}
