import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "#C8A96A",
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>

        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
          style={{ background: color }}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}