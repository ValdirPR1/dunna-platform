import { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={clsx(
        "w-full",
        "rounded-xl",
        "border border-[#2E2E2E]",
        "bg-[#181818]",
        "px-4 py-3",
        "text-white",
        "placeholder:text-zinc-500",
        "outline-none",
        "transition",

        "focus:border-[#C8A96A]",
        "focus:ring-2",
        "focus:ring-[#C8A96A]/20",

        className
      )}
      {...props}
    />
  );
}