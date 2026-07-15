"use client";

import KPICards from "./KPICards";
import SalesChart from "./SalesChart";
import AgendaCard from "./AgendaCard";
import AdvisorCard from "./AdvisorCard";
import MarketRadar from "./MarketRadar";
import RecentLeads from "./RecentLeads";
import ActivityCard from "./ActivityCard";
import OnlineStatus from "./OnlineStatus";
import DashboardHeader from "./DashboardHeader";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mx-auto max-w-[1700px] space-y-8"
>
      {/* Cabeçalho */}

      <section>

        <h1 className="text-4xl font-bold text-white">
          Boa tarde, Valdir 👋
        </h1>

        <p className="mt-2 text-zinc-400 text-lg">
          Bem-vindo à Central de Operações da Dunna Platform.
        </p>

      </section>

      {/* KPIs */}

      <KPICards />

      {/* Linha 1 */}

      <section className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <SalesChart />

        </div>

        <AdvisorCard />

      </section>

      {/* Linha 2 */}

      <section className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <RecentLeads />

        </div>

        <AgendaCard />

      </section>

      {/* Linha 3 */}

      <section className="grid gap-6 xl:grid-cols-2">

        <MarketRadar />

        <ActivityCard />

      </section>

      {/* Linha 4 */}

      <OnlineStatus />

    </motion.div>
  );
}