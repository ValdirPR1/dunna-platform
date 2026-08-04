import { CheckCircle2, XCircle } from "lucide-react";
import { MetaRealizacao } from "../types/meta";
import { definicaoDaMetrica } from "../types/meta";
import { formatarRotuloPeriodo } from "../utils/periodo";

interface Props {
  historico: MetaRealizacao[];
}

export default function HistoricoMetas({ historico }: Props) {
  if (historico.length === 0) {
    return (
      <p className="font-sans text-sm text-slate-400">
        Ainda não há períodos anteriores registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-left font-sans text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Período</th>
            <th className="px-4 py-3 font-medium">Métrica</th>
            <th className="px-4 py-3 font-medium">Meta</th>
            <th className="px-4 py-3 font-medium">Realizado</th>
            <th className="px-4 py-3 font-medium">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {historico.map((item) => {
            const def = definicaoDaMetrica(item.tipo_metrica);
            const bateu = item.valor_realizado >= item.valor_alvo && item.valor_alvo > 0;

            return (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3 capitalize text-navy">
                  {formatarRotuloPeriodo(item.periodo_inicio, def.periodicidade)}
                </td>
                <td className="px-4 py-3 text-navy">{def.label}</td>
                <td className="px-4 py-3 text-slate-500">{item.valor_alvo}</td>
                <td className="px-4 py-3 text-slate-500">{item.valor_realizado}</td>
                <td className="px-4 py-3">
                  {bateu ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <CheckCircle2 size={15} />
                      Bateu a meta
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle size={15} />
                      Não bateu
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
