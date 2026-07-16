import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-slate-500">
            {description}
          </p>
        )}

      </div>

      {children}

    </section>
  );
}