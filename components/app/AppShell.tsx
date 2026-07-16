"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-8">

          {children}

        </main>

      </div>

    </div>
  );
}