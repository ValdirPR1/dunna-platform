import { readFile } from "node:fs/promises";
import path from "node:path";

// Usado nos cartões gerados (ImageResponse) pra colocar a logo. Lendo
// direto do disco em vez de buscar por HTTP evita depender do próprio
// servidor conseguir se auto-acessar (auto-fetch pode falhar/travar
// dependendo do ambiente) — assim funciona igual em qualquer lugar.
const cache: Record<string, string> = {};

async function lerComoDataUri(caminhoRelativo: string): Promise<string> {
  if (cache[caminhoRelativo]) return cache[caminhoRelativo];

  const caminho = path.join(process.cwd(), "public", caminhoRelativo);
  const buffer = await readFile(caminho);
  const dataUri = `data:image/png;base64,${buffer.toString("base64")}`;
  cache[caminhoRelativo] = dataUri;

  return dataUri;
}

// Logo completa (marca branca, "DUNNA IMÓVEIS DE PRAIA") — usada sobre
// fundo escuro. Essa versão já vem recortada bem rente ao desenho
// (sem a margem transparente do arquivo original) — assim dá pra
// exibir do tamanho que for sem esticar/achatar a proporção.
export async function getLogoDataUri(): Promise<string> {
  return lerComoDataUri("logo/logodunna2-recortada.png");
}

// Só o brasão colorido (dourado + azul-marinho) — usado sobre fundo
// claro, junto com o nome escrito à parte.
export async function getMarcaIconeDataUri(): Promise<string> {
  return lerComoDataUri("logo/marca-icone.png");
}

// Logo completa colorida (a mesma do menu do site) — usada sobre
// fundo claro, já com o nome e "Imóveis de Praia" desenhados juntos.
export async function getSiteLogoDataUri(): Promise<string> {
  return lerComoDataUri("logo/dunna-site.png");
}
