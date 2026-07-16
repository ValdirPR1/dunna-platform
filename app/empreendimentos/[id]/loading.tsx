export default function Loading() {
  return (
    <div className="space-y-5">

      <div className="h-12 w-72 animate-pulse rounded-xl bg-slate-200" />

      <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />

      <div className="grid grid-cols-4 gap-6">

        <div className="h-36 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="h-36 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="h-36 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="h-36 rounded-2xl bg-slate-200 animate-pulse" />

      </div>

    </div>
  );
}