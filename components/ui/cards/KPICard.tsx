import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  variation?: string;
}

export default function KPICard({
  title,
  value,
  icon,
  variation,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">

            {title}

          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">

            {value}

          </h2>

          {variation && (

            <p className="mt-2 text-sm text-emerald-600">

              {variation}

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