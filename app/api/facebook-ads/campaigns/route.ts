import { NextResponse } from "next/server";

const GRAPH_VERSION = "v21.0";

export async function GET() {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;
  const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;

  if (!token || !adAccountId) {
    return NextResponse.json(
      {
        error:
          "Integração com o Facebook Ads não configurada. Verifique as variáveis FACEBOOK_ACCESS_TOKEN e FACEBOOK_AD_ACCOUNT_ID no .env.local.",
      },
      { status: 400 }
    );
  }

  const contaId = adAccountId.startsWith("act_")
    ? adAccountId
    : `act_${adAccountId}`;

  try {
    // 1. Dados básicos de cada campanha (nome, status, objetivo)
    const urlCampanhas = `https://graph.facebook.com/${GRAPH_VERSION}/${contaId}/campaigns?fields=id,name,status,objective&limit=100&access_token=${token}`;

    const respCampanhas = await fetch(urlCampanhas);
    const dadosCampanhas = await respCampanhas.json();

    if (dadosCampanhas.error) {
      return NextResponse.json(
        { error: dadosCampanhas.error.message },
        { status: 400 }
      );
    }

    // 2. Métricas dos últimos 30 dias, por campanha
    const urlInsights = `https://graph.facebook.com/${GRAPH_VERSION}/${contaId}/insights?level=campaign&fields=campaign_id,campaign_name,spend,reach,clicks,ctr,cpc,actions&date_preset=last_30d&limit=100&access_token=${token}`;

    const respInsights = await fetch(urlInsights);
    const dadosInsights = await respInsights.json();

    const insightsPorCampanha = new Map(
      (dadosInsights.data ?? []).map((item: any) => [item.campaign_id, item])
    );

    const campanhas = (dadosCampanhas.data ?? []).map((campanha: any) => {
      const insight: any = insightsPorCampanha.get(campanha.id);

      const conversoes = (insight?.actions ?? [])
        .filter((a: any) => a.action_type?.toLowerCase().includes("lead"))
        .reduce((soma: number, a: any) => soma + Number(a.value || 0), 0);

      return {
        id: campanha.id,
        nome: campanha.name,
        status: campanha.status,
        objetivo: campanha.objective,
        gasto: Number(insight?.spend ?? 0),
        alcance: Number(insight?.reach ?? 0),
        cliques: Number(insight?.clicks ?? 0),
        ctr: Number(insight?.ctr ?? 0),
        cpc: Number(insight?.cpc ?? 0),
        conversoes,
      };
    });

    return NextResponse.json({ campanhas });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Erro ao consultar o Facebook Ads." },
      { status: 500 }
    );
  }
}
