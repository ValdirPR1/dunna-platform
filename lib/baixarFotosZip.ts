import JSZip from "jszip";

/**
 * Baixa uma lista de fotos (URLs) num único arquivo .zip, pronto pra
 * salvar no computador — útil pra guardar fotos que às vezes se
 * perdem quando apagadas do celular.
 */
export async function baixarFotosComoZip(
  fotos: string[],
  nomeBase: string
) {
  if (fotos.length === 0) return;

  const zip = new JSZip();

  const resultados = await Promise.allSettled(
    fotos.map(async (url, index) => {
      const resposta = await fetch(url);
      const blob = await resposta.blob();

      const extensao = url.split(".").pop()?.split("?")[0] || "jpg";
      const nomeArquivo = `foto-${String(index + 1).padStart(2, "0")}.${extensao}`;

      zip.file(nomeArquivo, blob);
    })
  );

  const falhas = resultados.filter((r) => r.status === "rejected").length;

  const conteudoZip = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(conteudoZip);
  const link = document.createElement("a");
  link.href = url;

  const nomeSeguro = nomeBase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  link.download = `fotos-${nomeSeguro || "imovel"}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (falhas > 0) {
    throw new Error(
      `${falhas} de ${fotos.length} foto(s) não puderam ser baixadas, mas o restante foi salvo.`
    );
  }
}
