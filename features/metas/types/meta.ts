export type TipoMetrica =
  | "ligacoes"
  | "visitas"
  | "reunioes"
  | "vendas"
  | "captacoes";

export type Periodicidade = "semanal" | "mensal";

export interface DefinicaoMetrica {
  tipo: TipoMetrica;
  label: string;
  labelPeriodo: string;
  periodicidade: Periodicidade;
}

// Fonte única de verdade: quais métricas existem, como chamá-las e
// se são acompanhadas por semana ou por mês.
export const METRICAS: DefinicaoMetrica[] = [
  { tipo: "ligacoes", label: "Ligações", labelPeriodo: "por semana", periodicidade: "semanal" },
  { tipo: "visitas", label: "Visitas", labelPeriodo: "por semana", periodicidade: "semanal" },
  { tipo: "reunioes", label: "Reuniões", labelPeriodo: "por semana", periodicidade: "semanal" },
  { tipo: "vendas", label: "Vendas", labelPeriodo: "por mês", periodicidade: "mensal" },
  { tipo: "captacoes", label: "Captações de imóveis", labelPeriodo: "por mês", periodicidade: "mensal" },
];

export function definicaoDaMetrica(tipo: TipoMetrica): DefinicaoMetrica {
  return METRICAS.find((m) => m.tipo === tipo)!;
}

export interface Meta {
  id: string;
  corretor_id: string;
  tipo_metrica: TipoMetrica;
  valor_alvo: number;
  updated_at: string;
}

export interface MetaRealizacao {
  id: string;
  corretor_id: string;
  tipo_metrica: TipoMetrica;
  periodo_inicio: string;
  periodo_fim: string;
  valor_alvo: number;
  valor_realizado: number;
  atualizado_em: string;
}
