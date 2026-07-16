import { ReactNode } from "react";
import clsx from "clsx";

interface PanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function Panel({
  title,
  subtitle,
  children,
  className,
}: PanelProps) {
  return (
    <section
      className={clsx(
        "rounded-3xl",
        "border border-slate-200",
        "bg-white",
        "shadow-sm",
        "p-6",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-6">

          {title && (
            <h2 className="text-xl font-semibold text-slate-900">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>
      )}

      {children}

    </section>
  );
}