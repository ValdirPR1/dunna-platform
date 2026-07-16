import { ReactNode } from "react";

interface Props {
  cols?: 2 | 3 | 4;
  children: ReactNode;
}

export default function GridRow({
  cols = 3,
  children,
}: Props) {

  const columns = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid gap-6 ${columns[cols]}`}>
      {children}
    </div>
  );
}