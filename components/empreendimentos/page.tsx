import { listarEmpreendimentos } from "@/services/empreendimentos";

export default async function EmpreendimentosPage() {
  const empreendimentos = await listarEmpreendimentos();

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Empreendimentos
      </h1>

      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Cidade</th>
              <th className="p-4 text-left">Bairro</th>
              <th className="p-4 text-left">Construtora</th>
              <th className="p-4 text-left">Valor Inicial</th>
            </tr>
          </thead>

          <tbody>
            {empreendimentos?.map((emp: any) => (
              <tr
                key={emp.id}
                className="border-t border-zinc-800"
              >
                <td className="p-4">{emp.nome}</td>
                <td className="p-4">{emp.cidade}</td>
                <td className="p-4">{emp.bairro}</td>
                <td className="p-4">{emp.construtora}</td>
                <td className="p-4">
                  {Number(emp.valor_inicial).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}