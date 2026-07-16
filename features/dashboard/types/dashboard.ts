export interface DashboardKPIs {
  totalImoveis: number;
  totalEmpreendimentos: number;
  totalLeads: number;
  vgv: number;
}

export interface AdvisorAlert {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: "baixa" | "media" | "alta";
}

export interface DashboardData {
  kpis: DashboardKPIs;
  alerts: AdvisorAlert[];
}