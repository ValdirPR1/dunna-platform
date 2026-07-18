/**
 * Comprime uma imagem no próprio navegador antes do upload, reduzindo
 * o tamanho do arquivo (e o peso do site) sem exigir nenhuma mudança
 * de hábito de quem está cadastrando.
 *
 * - Redimensiona pro máximo de 1920px no lado maior (mais que suficiente
 *   pra qualquer tela, incluindo monitores grandes)
 * - Reexporta como JPEG com qualidade 82%, que na prática é
 *   visualmente idêntico ao original, mas bem mais leve
 * - Opcionalmente aplica a marca d'água (logo) no canto da foto
 */
export async function comprimirImagem(
  file: File,
  opcoes: {
    larguraMaxima?: number;
    qualidade?: number;
    comMarcaDagua?: boolean;
  } = {}
): Promise<File> {
  const {
    larguraMaxima = 1920,
    qualidade = 0.82,
    comMarcaDagua = false,
  } = opcoes;

  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const leitor = new FileReader();

    leitor.onload = (e) => {
      const img = new Image();

      img.onload = async () => {
        let { width, height } = img;

        if (width > larguraMaxima) {
          height = Math.round((height * larguraMaxima) / width);
          width = larguraMaxima;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        console.log("🖼️ comMarcaDagua recebido:", comMarcaDagua);

        if (comMarcaDagua) {
          await desenharMarcaDagua(ctx, width, height);
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            if (!comMarcaDagua && blob.size >= file.size) {
              resolve(file);
              return;
            }

            const novoNome =
              file.name.replace(/\.[^.]+$/, "") + ".jpg";

            resolve(
              new File([blob], novoNome, { type: "image/jpeg" })
            );
          },
          "image/jpeg",
          qualidade
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    leitor.onerror = () => resolve(file);
    leitor.readAsDataURL(file);
  });
}

async function desenharMarcaDagua(
  ctx: CanvasRenderingContext2D,
  larguraCanvas: number,
  alturaCanvas: number
) {
  return new Promise<void>((resolve) => {
    const logo = new Image();

    logo.onload = () => {
      console.log("🖼️ Logo da marca d'água carregado com sucesso");

      // A marca d'água ocupa ~28% da largura da foto, centralizada,
      // com opacidade baixa pra ficar discreta
      const larguraLogo = larguraCanvas * 0.28;
      const alturaLogo = (logo.height / logo.width) * larguraLogo;

      const x = (larguraCanvas - larguraLogo) / 2;
      const y = (alturaCanvas - alturaLogo) / 2;

      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.drawImage(logo, x, y, larguraLogo, alturaLogo);
      ctx.restore();

      resolve();
    };

    logo.onerror = () => {
      console.log("🖼️ ERRO: não conseguiu carregar o logo da marca d'água");
      resolve();
    };
    logo.src = "/logo/dunna-site.png";
  });
}
