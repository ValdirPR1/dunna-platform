import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl",
        "border border-[#2A2A2A]",
        "bg-[#151515]",
        "p-6",
        "shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}