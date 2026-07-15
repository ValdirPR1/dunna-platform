import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition-all duration-200",

        "disabled:opacity-50 disabled:cursor-not-allowed",

        {
          "bg-[#C8A96A] text-black hover:brightness-110":
            variant === "primary",

          "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]":
            variant === "secondary",

          "border border-[#3A3A3A] text-white hover:bg-[#202020]":
            variant === "outline",

          "bg-red-600 text-white hover:bg-red-700":
            variant === "danger",
        },

        className
      )}
      {...props}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}