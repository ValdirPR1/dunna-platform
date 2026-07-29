import { ImageResponse } from "next/og";
import { getImovelBySlug } from "@/features/site/services/imoveis.service";
import { SITE_URL } from "@/lib/siteUrl";
import { getLogoDataUri } from "@/lib/logoDataUri";

export const revalidate = 0;

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Gera uma imagem "cartão" do imóvel (foto + título + localização +
// preço) pra ser compartilhada no Instagram — feed ou Stories. É essa
// imagem que o botão de compartilhar nativo usa no lugar da foto crua,
// pra já sair anunciando o imóvel em vez de só uma foto solta.
export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    return new Response("Imóvel não encontrado", { status: 404 });
  }

  const local = [imovel.bairro, imovel.cidade].filter(Boolean).join(", ");

  const specs = [
    imovel.quartos ? `${imovel.quartos} quartos` : null,
    imovel.banheiros ? `${imovel.banheiros} banheiros` : null,
    imovel.vagas ? `${imovel.vagas} vagas` : null,
    imovel.area_privativa ? `${imovel.area_privativa}m²` : null,
  ]
    .filter(Boolean)
    .join("   •   ");

  const dominioExibido = SITE_URL.replace(/^https?:\/\//, "");
  const logoDataUri = await getLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          position: "relative",
          backgroundColor: "#101828",
        }}
      >
        {imovel.foto_capa && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imovel.foto_capa}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1080px",
              height: "1920px",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "linear-gradient(to bottom, rgba(16,24,40,0.10) 0%, rgba(16,24,40,0.05) 32%, rgba(16,24,40,0.88) 66%, rgba(16,24,40,0.98) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 72,
            left: 64,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUri}
            width={190}
            height={71}
            style={{ height: "71px", width: "190px" }}
          />
        </div>

        {imovel.selo && (
          <div
            style={{
              position: "absolute",
              top: 72,
              right: 64,
              display: "flex",
              backgroundColor: "#C8A96A",
              borderRadius: 999,
              padding: "14px 30px",
            }}
          >
            <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>
              {imovel.selo}
            </span>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "0 64px 96px",
          }}
        >
          {local && (
            <span
              style={{
                color: "#E4C989",
                fontSize: 34,
                fontWeight: 600,
                marginBottom: 14,
                display: "flex",
              }}
            >
              {local}
            </span>
          )}

          <span
            style={{
              color: "white",
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 26,
              display: "flex",
            }}
          >
            {imovel.titulo}
          </span>

          {specs && (
            <span
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 32,
                marginBottom: 30,
                display: "flex",
              }}
            >
              {specs}
            </span>
          )}

          {imovel.preco ? (
            <span
              style={{
                color: "#C8A96A",
                fontSize: 72,
                fontWeight: 800,
                marginBottom: 40,
                display: "flex",
              }}
            >
              {formatarPreco(imovel.preco)}
            </span>
          ) : null}

          <div
            style={{
              display: "flex",
              borderTop: "2px solid rgba(255,255,255,0.25)",
              paddingTop: 32,
            }}
          >
            <span style={{ color: "white", fontSize: 30, fontWeight: 600 }}>
              Saiba mais em {dominioExibido}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
