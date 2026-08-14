import { obterConfiguracoes } from "@/features/configuracoes/services/configuracoes.service";

export interface AvaliacaoGoogle {
  autor: string;
  fotoAutor: string | null;
  nota: number;
  texto: string;
  tempoRelativo: string;
  linkPerfilAutor: string | null;
}

export interface AvaliacoesGoogle {
  disponivel: boolean;
  motivo?: string;
  nome?: string;
  notaMedia?: number;
  totalAvaliacoes?: number;
  linkGoogle?: string;
  linkAvaliar?: string;
  avaliacoes?: AvaliacaoGoogle[];
}

// Busca as avaliações do Google Negócios da Dunna via API do Google
// Places. Depende de duas configurações cadastradas em Configurações
// → Integrações: a chave de API do Google Maps (a mesma já usada
// pelos mapas interativos, só precisa ter a "Places API" habilitada
// no Google Cloud) e o Place ID do perfil da Dunna no Google.
//
// Limitação da própria API do Google (não é bug nosso): o Google só
// devolve até 5 avaliações "mais relevantes" escolhidas pelo
// algoritmo deles, nunca a lista completa — não existe um jeito de
// pedir mais do que isso pela API gratuita/padrão.
export async function obterAvaliacoesGoogle(): Promise<AvaliacoesGoogle> {
  const config = await obterConfiguracoes();
  const chave = config.google_maps_api_key;
  const placeId = config.google_place_id;

  if (!chave || !placeId) {
    return {
      disponivel: false,
      motivo:
        "Cadastre a chave de API do Google Maps e o Place ID da Dunna em Configurações → Integrações pra ativar essa área.",
    };
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json"
    );
    url.searchParams.set("place_id", placeId);
    url.searchParams.set(
      "fields",
      "name,rating,user_ratings_total,reviews,url"
    );
    url.searchParams.set("language", "pt-BR");
    url.searchParams.set("key", chave);

    // Cache de 6h — evita bater na API do Google a cada visita ao
    // site (as avaliações não mudam de minuto em minuto, e cada
    // chamada à API do Google tem custo).
    const resp = await fetch(url.toString(), {
      next: { revalidate: 21600 },
    });

    const dados = await resp.json();

    if (dados.status !== "OK" || !dados.result) {
      return {
        disponivel: false,
        motivo:
          dados.status === "REQUEST_DENIED"
            ? "A chave de API do Google recusou o pedido — confira se a 'Places API' está habilitada pra essa chave no Google Cloud Console."
            : `O Google não devolveu os dados esperados (status: ${dados.status ?? "desconhecido"}).`,
      };
    }

    const resultado = dados.result;

    const avaliacoes: AvaliacaoGoogle[] = (resultado.reviews ?? []).map(
      (r: any) => ({
        autor: r.author_name,
        fotoAutor: r.profile_photo_url ?? null,
        nota: r.rating,
        texto: r.text,
        tempoRelativo: r.relative_time_description,
        linkPerfilAutor: r.author_url ?? null,
      })
    );

    return {
      disponivel: true,
      nome: resultado.name,
      notaMedia: resultado.rating,
      totalAvaliacoes: resultado.user_ratings_total,
      linkGoogle: resultado.url,
      linkAvaliar: `https://search.google.com/local/writereview?placeid=${placeId}`,
      avaliacoes,
    };
  } catch (error) {
    console.error("Erro ao buscar avaliações do Google:", error);
    return {
      disponivel: false,
      motivo: "Não foi possível buscar as avaliações agora. Tenta de novo mais tarde.",
    };
  }
}
