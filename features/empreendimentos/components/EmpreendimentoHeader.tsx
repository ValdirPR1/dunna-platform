"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function EmpreendimentoHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-4xl font-bold">
          Empreendimentos
        </h1>

        <p className="mt-2 text-zinc-400">
          Gestão completa dos empreendimentos
        </p>
      </div>

      <Button
        onClick={() =>
          router.push("/empreendimentos/novo")
        }
      >
        Novo Empreendimento
      </Button>

    </div>
  );
}