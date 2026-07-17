import Page from "@/components/ui/layout/Page";
import PageHeader from "@/components/ui/layout/PageHeader";

import DashboardGrid from "@/components/ui/layout/DashboardGrid";
import GridRow from "@/components/ui/layout/GridRow";

import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsGrid from "@/components/dashboard/StatsGrid";

import AdvisorPanel from "@/components/dashboard/panels/AdvisorPanel";
import AgendaPanel from "@/components/dashboard/panels/AgendaPanel";
import MarketPanel from "@/components/dashboard/panels/MarketPanel";
import PipelinePanel from "@/components/dashboard/panels/PipelinePanel";
import RecentLeadsPanel from "@/components/dashboard/panels/RecentLeadsPanel";
import ActivityPanel from "@/components/dashboard/panels/ActivityPanel";
import ImoveisVisualizadosPanel from "@/components/dashboard/panels/ImoveisVisualizadosPanel";

export default function DashboardPage() {

  return (

    <Page>

      <PageHeader
        title="Painel"
        subtitle="Centro de Operações da Dunna"
      />

      <DashboardGrid>

        <DashboardHero />

        <StatsGrid />

        <GridRow>

          <AdvisorPanel />

          <AgendaPanel />

          <MarketPanel />

        </GridRow>

        <GridRow cols={2}>

          <PipelinePanel />

          <RecentLeadsPanel />

        </GridRow>

        <ImoveisVisualizadosPanel />

        <ActivityPanel />

      </DashboardGrid>

    </Page>

  );

}