export default function DashboardHero() {
  return (
    <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

      <span className="rounded-full bg-[#C8A96A]/10 px-4 py-2 text-sm font-semibold text-[#B68B2C]">
        Centro de Operações
      </span>

      <h1 className="mt-5 text-5xl font-bold text-slate-900">
        Bom dia, Valdir 👋
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-slate-500">
        Hoje existem
        <strong> 14 leads </strong>
        aguardando atendimento,
        <strong> 6 visitas </strong>
        agendadas e
        <strong> 2 propostas </strong>
        pendentes.
      </p>

    </div>
  );
}