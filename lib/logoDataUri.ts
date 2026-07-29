import { readFile } from "node:fs/promises";
import path from "node:path";

// Usado nos cartões gerados (ImageResponse) pra colocar a logo. Lendo
// direto do disco em vez de buscar por HTTP evita depender do próprio
// servidor conseguir se auto-acessar (auto-fetch pode falhar/travar
// dependendo do ambiente) — assim funciona igual em qualquer lugar.
let cache: string | null = null;

export async function getLogoDataUri(): Promise<string> {
  if (cache) return cache;

  const caminho = path.join(process.cwd(), "public/logo/logodunna2.png");
  const buffer = await readFile(caminho);
  cache = `data:image/png;base64,${buffer.toString("base64")}`;

  return cache;
}
