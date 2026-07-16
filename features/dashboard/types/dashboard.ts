export interface DashboardKPIs {
  totalImoveis: number;
  totalImoveisPublicados: number;
  totalEmpreendimentos: number;
  totalEmpreendimentosAtivos: number;
  totalClientes: number;
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