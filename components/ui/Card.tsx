import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function Card({
  children,
  title,
  subtitle,
  action,
  className,
}: CardProps) {
  return (
    <section
      className={clsx(
        "rounded-3xl",
        "border border-slate-200",
        "bg-white",
        "shadow-sm",
        "transition-all",
        "duration-200",
        "hover:shadow-md",
        className
      )}
    >
      {(title || subtitle || action) && (
        <header className="flex items-start justify-between border-b border-slate-100 p-6">

          <div>

            {title && (
              <h2 className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}

          </div>

          {action}

        </header>
      )}

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}