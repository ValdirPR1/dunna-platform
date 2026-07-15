"use client";

const services = [
  "Supabase",
  "API",
  "WhatsApp",
  "IA",
];

export default function OnlineStatus() {
  return (
    <div className="rounded-3xl border border-emerald-900 bg-emerald-500/5 p-6">

      <h2 className="mb-5 text-xl font-bold">
        Sistema
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {services.map((service) => (

          <div
            key={service}
            className="flex items-center gap-3 rounded-xl bg-zinc-900 p-4"
          >

            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"/>

            <span>
              {service}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}