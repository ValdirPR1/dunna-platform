"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Content({ children }: Props) {
  return (
    <main className="flex-1 p-10 overflow-auto">
      {children}
    </main>
  );
}