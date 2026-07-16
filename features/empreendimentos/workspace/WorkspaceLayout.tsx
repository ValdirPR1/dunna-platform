"use client";

import { useState } from "react";

import WorkspaceMenu from "./WorkspaceMenu";

import DashboardTab from "./DashboardTab";
import UnidadesTab from "./UnidadesTab";
import GaleriaTab from "./GaleriaTab";
import DocumentosTab from "./DocumentosTab";
import FinanceiroTab from "./FinanceiroTab";
import MarketingTab from "./MarketingTab";
import HistoricoTab from "./HistoricoTab";
import AdvisorTab from "./AdvisorTab";

export default function WorkspaceLayout() {

  const [tab, setTab] =
    useState("Dashboard");

  return (

    <>

      <WorkspaceMenu
        active={tab}
        onChange={setTab}
      />

      <div className="mt-8">

        {tab === "Dashboard" && <DashboardTab />}

        {tab === "Unidades" && <UnidadesTab />}

        {tab === "Galeria" && <GaleriaTab />}

        {tab === "Documentos" && <DocumentosTab />}

        {tab === "Financeiro" && <FinanceiroTab />}

        {tab === "Marketing" && <MarketingTab />}

        {tab === "Histórico" && <HistoricoTab />}

        {tab === "Advisor IA" && <AdvisorTab />}

      </div>

    </>

  );

}