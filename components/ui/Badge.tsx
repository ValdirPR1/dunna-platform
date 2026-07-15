import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  color?:
    | "green"
    | "red"
    | "yellow"
    | "blue"
    | "gray";
}

export default function Badge({
  children,
  color = "gray",
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold",

        {
          "bg-green-500/20 text-green-400":
            color === "green",

          "bg-red-500/20 text-red-400":
            color === "red",

          "bg-yellow-500/20 text-yellow-400":
            color === "yellow",

          "bg-blue-500/20 text-blue-400":
            color === "blue",

          "bg-zinc-700 text-zinc-300":
            color === "gray",
        }
      )}
    >
      {children}
    </span>
  );
}