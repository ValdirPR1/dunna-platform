"use client";

import { Home, Users, Building2, DollarSign } from "lucide-react";
import StatCard from "./StatCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

function formatarMoeda(valor: number) {
  if (valor >= 1_000_000) {
    return `R$ ${(valor / 1_000_000).toFixed(1)} Mi`;
  }
  if (valor >= 1_000) {
    return `R$ ${(valor / 1_000).toFixed(0)} mil`;
  }
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function StatsGrid() {
  const { data, loading } = useDashboard();

  const kpis = data ?? {
    totalImoveis: 0,
    totalImoveisPublicados: 0,
    totalEmpreendimentos: 0,
    totalEmpreendimentosAtivos: 0,
    totalClientes: 0,
    vgv: 0,
  };

  return (
    <div className="grid grid-cols-4 gap-6">

      <StatCard
        title="Imóveis"
        numero={loading ? 0 : kpis.totalImoveis}
        subtitle={`${kpis.totalImoveisPublicados} publicados no site`}
        icon={<Home size={26} />}
      />

      <StatCard
        title="Clientes"
        numero={loading ? 0 : kpis.totalClientes}
        subtitle="Cadastrados no CRM"
        icon={<Users size={26} />}
      />

      <StatCard
        title="Empreendimentos"
        numero={loading ? 0 : kpis.totalEmpreendimentos}
        subtitle={`${kpis.totalEmpreendimentosAtivos} ativos`}
        icon={<Building2 size={26} />}
      />

      <StatCard
        title="VGV"
        numero={loading ? 0 : kpis.vgv}
        formatar={formatarMoeda}
        subtitle="Carteira publicada"
        icon={<DollarSign size={26} />}
      />

    </div>
  );
}
