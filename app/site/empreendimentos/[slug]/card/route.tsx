import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { getEmpreendimentoBySlug } from "@/features/site/services/empreendimentos.service";
import { SITE_URL } from "@/lib/siteUrl";
import { getLogoDataUri } from "@/lib/logoDataUri";
import {
  BuildingIcon,
  RulerIcon,
  CalendarIcon,
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
// mesmo padrão usado no cartão de imóvel, pra manter a identidade.
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

// Mesma ideia do cartão de imóvel: gera uma imagem com foto + nome +
// localização + informações + valor do empreendimento, pra
// compartilhar no Instagram em vez de só a foto crua.
export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const empreendimento = await getEmpreendimentoBySlug(slug);

  if (!empreendimento) {
    return new Response("Empreendimento não encontrado", { status: 404 });
  }

  const local = [empreendimento.bairro, empreendimento.cidade]
    .filter(Boolean)
    .join(", ");
  const dominioExibido = SITE_URL.replace(/^https?:\/\//, "");
  const logoDataUri = await getLogoDataUri();

  const specsChips = [
    empreendimento.tipo
      ? { icone: <BuildingIcon size={20} color="white" />, valor: empreendimento.tipo }
      : null,
    empreendimento.area_final
      ? { icone: <RulerIcon size={20} color="white" />, valor: `${empreendimento.area_final}m²` }
      : null,
    empreendimento.entrega
      ? { icone: <CalendarIcon size={20} color="white" />, valor: empreendimento.entrega }
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

        {/* Marca */}
        <div
          style={{
            position: "absolute",
            top: 230,
            left: (LARGURA - 520) / 2,
            width: 520,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUri}
            width={520}
            height={115}
            style={{ width: "520px", height: "115px" }}
          />
        </div>

        {/* Cartão branco flutuante */}
        <div
          style={{
            position: "absolute",
            top: 410,
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
            {empreendimento.fotoCapa && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={empreendimento.fotoCapa}
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

            {empreendimento.status && (
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
                  {empreendimento.status}
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
              {empreendimento.nome}
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
                      padding: "10px 22px 10px 10px",
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
                {empreendimento.valor_inicial ? "A partir de" : "Valor"}
              </span>

              {empreendimento.valor_inicial ? (
                <span
                  style={{
                    color: "#A67C2E",
                    fontSize: 62,
                    fontWeight: 800,
                    display: "flex",
                  }}
                >
                  {formatarPreco(empreendimento.valor_inicial)}
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
