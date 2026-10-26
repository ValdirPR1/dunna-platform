export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-navy outline-none focus:border-gold";
export const labelClass =
  "mb-2 block font-sans text-sm font-medium text-slate-600";

export function paraDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function datetimeLocalAgora(maisMinutos = 60) {
  return paraDatetimeLocal(new Date(Date.now() + maisMinutos * 60000).toISOString());
}

export function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarMoeda(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function mesmoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function inicioDoDia(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function linkWhatsapp(telefone: string | null) {
  if (!telefone) return null;
  let n = telefone.replace(/\D/g, "");
  if (n.length <= 11) n = "55" + n;
  return `https://wa.me/${n}`;
}
