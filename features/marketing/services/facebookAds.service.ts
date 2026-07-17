export interface CampanhaFacebook {
  id: string;
  nome: string;
  status: string;
  objetivo: string;
  gasto: number;
  alcance: number;
  cliques: number;
  ctr: number;
  cpc: number;
  conversoes: number;
}

export async function listarCampanhas(): Promise<{
  campanhas: CampanhaFacebook[];
  erro?: string;
}> {
  try {
    const resp = await fetch("/api/facebook-ads/campaigns");
    const dados = await resp.json();

    if (!resp.ok) {
      return { campanhas: [], erro: dados.error };
    }

    return { campanhas: dados.campanhas ?? [] };
  } catch (error) {
    return {
      campanhas: [],
      erro: "Não foi possível conectar com o Facebook Ads.",
    };
  }
}
