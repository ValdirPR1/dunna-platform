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

  // TIFF e formatos de câmera profissional (RAW) praticamente nenhum
  // navegador consegue abrir — por isso são recusados aqui de cara,
  // com um aviso claro, em vez de tentar e travar mais na frente.
  //
  // HEIC/HEIF (padrão de fotos do iPhone) foi removido dessa lista:
  // vários navegadores (Safari, e o Chrome no macOS em muitos casos)
  // conseguem sim abrir esse formato — bloquear sempre, sem tentar,
  // impedia cadastros com foto vindos direto do rolo de fotos do
  // iPhone sem motivo. Se o navegador realmente não conseguir abrir,
  // o img.onerror logo abaixo já cobre esse caso com uma mensagem clara.
  const formatosNaoSuportados = ["image/tiff", "image/tif"];
  const extensaoNaoSuportada = /\.(tif|tiff|raw|cr2|nef|arw)$/i.test(
    file.name
  );

  if (
    formatosNaoSuportados.includes(file.type) ||
    extensaoNaoSuportada
  ) {
    throw new Error(
      `O arquivo "${file.name}" está num formato que o navegador não consegue processar (TIFF ou similar). Converte pra JPG ou PNG antes de enviar.`
    );
  }

  return new Promise((resolve, reject) => {
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

      img.onerror = () =>
        reject(
          new Error(
            `Não foi possível abrir a imagem "${file.name}". Verifica se o arquivo não está corrompido ou num formato incomum.`
          )
        );
      img.src = e.target?.result as string;
    };

    leitor.onerror = () =>
      reject(new Error(`Não foi possível ler o arquivo "${file.name}".`));
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
      // Não trava o upload da foto por causa disso — mas registra o
      // erro de verdade (antes era só um console.log, fácil de passar
      // despercebido), já que sem isso a foto sobe sem marca d'água
      // silenciosamente, sem ninguém perceber.
      console.error("Não foi possível carregar o logo da marca d'água.");
      resolve();
    };
    logo.src = "/logo/marcadguadunna.png";
  });
}
