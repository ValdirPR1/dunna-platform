import { ImageResponse } from "next/og";
import { getEmpreendimentoBySlug } from "@/features/site/services/empreendimentos.service";
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

// Mesma ideia do cartão de imóvel: gera uma imagem com foto + nome +
// localização + preço do empreendimento, pra compartilhar no
// Instagram em vez de só a foto crua.
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
        {empreendimento.fotoCapa && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={empreendimento.fotoCapa}
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

        {empreendimento.status && (
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
              {empreendimento.status}
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
            {empreendimento.nome}
          </span>

          {empreendimento.valor_inicial ? (
            <span
              style={{
                color: "#C8A96A",
                fontSize: 60,
                fontWeight: 800,
                marginBottom: 40,
                display: "flex",
              }}
            >
              A partir de {formatarPreco(empreendimento.valor_inicial)}
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
