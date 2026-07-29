import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { getImovelBySlug } from "@/features/site/services/imoveis.service";
import { SITE_URL } from "@/lib/siteUrl";
import { getMarcaIconeDataUri } from "@/lib/logoDataUri";
import {
  BedIcon,
  BathIcon,
  CarIcon,
  RulerIcon,
  PinIcon,
} from "@/components/shared/icons/CardSpecIcons";

export const revalidate = 0;

const LARGURA = 1080;
const ALTURA = 1920;

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

// Textura decorativa de losangos no fundo, atrás do cartão branco —
// dá um acabamento mais "de marca" em vez de um fundo liso.
function padraoDeFundo() {
  const pontos: { x: number; y: number }[] = [];
  const espacamento = 168;

  for (let linha = 0; linha < 13; linha++) {
    const deslocamento = linha % 2 === 0 ? 0 : espacamento / 2;
    for (let coluna = -1; coluna < 8; coluna++) {
      pontos.push({
        x: coluna * espacamento + deslocamento,
        y: linha * espacamento - 80,
      });
    }
  }

  return pontos.map((p, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        top: p.y,
        left: p.x,
        width: 64,
        height: 64,
        border: "2px solid rgba(200,169,106,0.14)",
        transform: "rotate(45deg)",
        display: "flex",
      }}
    />
  ));
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Gera uma imagem "cartão" do imóvel (foto + título + localização +
// características + preço) pra ser compartilhada no Instagram — feed
// ou Stories. É essa imagem que o botão de compartilhar nativo usa no
// lugar da foto crua, pra já sair anunciando o imóvel em vez de só
// uma foto solta.
export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    return new Response("Imóvel não encontrado", { status: 404 });
  }

  const local = [imovel.bairro, imovel.cidade].filter(Boolean).join(", ");
  const dominioExibido = SITE_URL.replace(/^https?:\/\//, "");
  const marcaIconeDataUri = await getMarcaIconeDataUri();

  const specsChips = [
    imovel.quartos
      ? { icone: <BedIcon size={20} color="white" />, valor: `${imovel.quartos}` }
      : null,
    imovel.banheiros
      ? { icone: <BathIcon size={20} color="white" />, valor: `${imovel.banheiros}` }
      : null,
    imovel.area_privativa
      ? { icone: <RulerIcon size={20} color="white" />, valor: `${imovel.area_privativa}m²` }
      : null,
    imovel.vagas
      ? { icone: <CarIcon size={20} color="white" />, valor: `${imovel.vagas}` }
      : null,
  ].filter(Boolean) as { icone: ReactNode; valor: string }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: `${LARGURA}px`,
          height: `${ALTURA}px`,
          display: "flex",
          position: "relative",
          backgroundColor: "#0d1526",
        }}
      >
        {padraoDeFundo()}

        {/* Barra da marca */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: (LARGURA - 400) / 2,
            width: 400,
            height: 88,
            borderRadius: 999,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={marcaIconeDataUri}
            width={44}
            height={44}
            style={{ width: "44px", height: "44px" }}
          />
          <span
            style={{
              color: "#101828",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 1,
              display: "flex",
            }}
          >
            DUNNA IMOB
          </span>
        </div>

        {/* Cartão branco flutuante */}
        <div
          style={{
            position: "absolute",
            top: 176,
            left: 48,
            width: LARGURA - 96,
            borderRadius: 40,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Foto */}
          <div
            style={{
              position: "relative",
              display: "flex",
              width: "100%",
              height: 720,
              backgroundColor: "#1E2A3F",
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
                  width: "100%",
                  height: "720px",
                  objectFit: "cover",
                }}
              />
            )}

            {imovel.selo && (
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  right: 28,
                  display: "flex",
                  backgroundColor: "#C8A96A",
                  borderRadius: 999,
                  padding: "12px 26px",
                }}
              >
                <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>
                  {imovel.selo}
                </span>
              </div>
            )}

            {local && (
              <div
                style={{
                  position: "absolute",
                  bottom: -26,
                  left: 32,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: "#101828",
                  borderRadius: 999,
                  padding: "14px 26px",
                }}
              >
                <PinIcon size={20} color="#E4C989" />
                <span style={{ color: "white", fontSize: 24, fontWeight: 600 }}>
                  {local}
                </span>
              </div>
            )}
          </div>

          {/* Informações */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "56px 48px 56px",
            }}
          >
            <span
              style={{
                color: "#101828",
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 28,
                display: "flex",
              }}
            >
              {imovel.titulo}
            </span>

            {specsChips.length > 0 && (
              <div style={{ display: "flex", gap: 16, marginBottom: 36 }}>
                {specsChips.map((chip, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: "#F5F1E7",
                      borderRadius: 999,
                      padding: "10px 20px 10px 10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        backgroundColor: "#C8A96A",
                      }}
                    >
                      {chip.icone}
                    </div>
                    <span
                      style={{
                        color: "#101828",
                        fontSize: 26,
                        fontWeight: 700,
                      }}
                    >
                      {chip.valor}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                display: "flex",
                borderTop: "2px solid #EEE8D8",
                marginBottom: 28,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: 24,
                  fontWeight: 600,
                  marginBottom: 8,
                  display: "flex",
                }}
              >
                Valor
              </span>

              {imovel.preco ? (
                <span
                  style={{
                    color: "#A67C2E",
                    fontSize: 66,
                    fontWeight: 800,
                    display: "flex",
                  }}
                >
                  {formatarPreco(imovel.preco)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Chamada final */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "white", fontSize: 30, fontWeight: 600 }}>
            Saiba mais em {dominioExibido}
          </span>
        </div>
      </div>
    ),
    { width: LARGURA, height: ALTURA }
  );
}
