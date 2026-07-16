import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Page({
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-[1700px] space-y-8">

      {children}

    </div>
  );
}