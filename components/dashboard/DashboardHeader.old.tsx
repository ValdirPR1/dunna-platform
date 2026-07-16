"use client";

export default function DashboardHeader() {

  const hour = new Date().getHours();

  let greeting = "Boa noite";

  if (hour < 12) greeting = "Bom dia";

  if (hour >= 12 && hour < 18) greeting = "Boa tarde";

  return (

    <div className="mb-8 flex items-center justify-between">

      <div>

        <h1 className="text-5xl font-bold">

          {greeting}, Valdir 👋

        </h1>

        <p className="mt-2 text-zinc-400">

          Bem-vindo à Central de Operações da Dunna Platform.

        </p>

      </div>

      <div className="rounded-2xl border border-[#C8A96A]/20 bg-[#C8A96A]/5 px-6 py-4">

        <p className="text-sm text-zinc-400">

          VGV Monitorado

        </p>

        <p className="mt-1 text-3xl font-bold text-[#C8A96A]">

          R$ 48,5 Mi

        </p>

      </div>

    </div>

  );

}