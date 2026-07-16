"use client";

import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <AppSidebar />

      <div className="flex flex-1 flex-col">

        <AppHeader />

        <main className="flex-1 overflow-auto bg-slate-100 p-8">

          {children}

        </main>

      </div>

    </div>
  );
}