export default function DashboardTab() {

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <p className="text-slate-500">

          Unidades

        </p>

        <h2 className="mt-3 text-4xl font-bold">

          84

        </h2>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <p className="text-slate-500">

          Disponíveis

        </p>

        <h2 className="mt-3 text-4xl font-bold">

          27

        </h2>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <p className="text-slate-500">

          Vendidas

        </p>

        <h2 className="mt-3 text-4xl font-bold">

          57

        </h2>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <p className="text-slate-500">

          Publicação

        </p>

        <h2 className="mt-3 text-4xl font-bold text-emerald-600">

          Online

        </h2>

      </div>

    </div>

  );

}