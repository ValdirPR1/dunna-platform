import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DashboardGrid({
  children,
}: Props) {
  return (
    <div className="space-y-6">

      {children}

    </div>
  );
}