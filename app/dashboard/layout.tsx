import { ReactNode } from "react";
import AppShell from "@/components/app/AppShell";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}