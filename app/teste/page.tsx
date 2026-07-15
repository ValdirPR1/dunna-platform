import { listarEmpreendimentos } from "@/services/empreendimentos";

export default async function Teste() {
  const empreendimentos = await listarEmpreendimentos();

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Conexão Supabase
      </h1>

      <pre className="rounded-xl bg-zinc-900 p-6 text-white">
        {JSON.stringify(empreendimentos, null, 2)}
      </pre>
    </div>
  );
}