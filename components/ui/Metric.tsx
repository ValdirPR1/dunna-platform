import { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
}

export default function Metric({
  label,
  value,
  icon,
  trend,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {label}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          {trend && (
            <p className="mt-2 text-sm font-medium text-emerald-600">
              {trend}
            </p>
          )}

        </div>

        <div className="rounded-2xl bg-[#C8A96A] p-4 text-white">
          {icon}
        </div>

      </div>

    </div>
  );
}