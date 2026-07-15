import {
  DollarSign,
  Building2,
  Users,
  UserPlus,
} from "lucide-react";

import KPI from "./KPI";

const data = [
  {
    title: "VGV",
    value: "R$ 48,5 Mi",
    growth: "+18%",
    icon: DollarSign,
  },
  {
    title: "Empreendimentos",
    value: "48",
    growth: "+4",
    icon: Building2,
  },
  {
    title: "Clientes",
    value: "326",
    growth: "+12%",
    icon: Users,
  },
  {
    title: "Leads Hoje",
    value: "18",
    growth: "+6",
    icon: UserPlus,
  },
];

export default function KPICards() {
  return (
    <section className="grid gap-6 xl:grid-cols-4 md:grid-cols-2">
      {data.map((item) => (
        <KPI key={item.title} {...item} />
      ))}
    </section>
  );
}