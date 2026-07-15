"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Content from "./Content";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <Content>{children}</Content>
      </div>
    </div>
  );
}